import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getMoodEntries, getJournalEntries, findUserById } from "@/lib/db-helpers"

export async function GET(req: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "month"
  const includePersonal = searchParams.get("includePersonal") === "true"

  const userId = user.userId

  // Fetch user profile data
  const userData = await findUserById(userId)
  const profile = userData?.profile || {}

  // Fetch mood and journal data
  const moods = await getMoodEntries(userId, 200)
  const journals = await getJournalEntries(userId, 200)

  // Filter by range
  const filtered = filterByRange(moods, range)
  const filteredJournals = filterByRange(journals, range)

  // Calculate statistics
  const avgMood =
    filtered.length > 0 ? (filtered.reduce((sum, m) => sum + m.mood, 0) / filtered.length).toFixed(1) : "N/A"

  const moodDistribution = {
    excellent: filtered.filter((m) => m.mood >= 4.5).length,
    good: filtered.filter((m) => m.mood >= 3.5 && m.mood < 4.5).length,
    neutral: filtered.filter((m) => m.mood >= 2.5 && m.mood < 3.5).length,
    low: filtered.filter((m) => m.mood >= 1.5 && m.mood < 2.5).length,
    poor: filtered.filter((m) => m.mood < 1.5).length,
  }

  // Generate HTML for PDF
  const html = generatePDFHTML(
    userData,
    profile,
    range,
    avgMood,
    filtered,
    filteredJournals,
    moodDistribution,
    includePersonal,
  )

  const userIdShort = userId.toString().slice(-4)
  const periodText = range === "day" ? "Daily" : range === "week" ? "Weekly" : "Monthly"

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `attachment; filename="MH-USER-${userIdShort}_${periodText}_Summary.html"`,
    },
  })
}

function filterByRange(data: any[], range: string) {
  const now = new Date()

  return data.filter((item) => {
    const d = new Date(item.date)

    if (range === "day") {
      return d.toDateString() === now.toDateString()
    }

    if (range === "week") {
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      return diff <= 7
    }

    if (range === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }

    return true
  })
}

function generatePDFHTML(
  userData: any,
  profile: any,
  range: string,
  avgMood: string,
  moods: any[],
  journals: any[],
  moodDistribution: any,
  includePersonal: boolean,
) {
  const periodText = range === "day" ? "Daily" : range === "week" ? "Weekly" : "Monthly"
  const totalPercentage = moods.length || 1
  const userIdShort = userData?._id?.toString().slice(-4) || "XXXX"

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wellness Summary - ${periodText}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: white;
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #6b7280;
            padding-bottom: 30px;
            margin-bottom: 40px;
        }
        .header h1 {
            font-size: 32px;
            color: #1f2937;
            margin-bottom: 10px;
        }
        .header .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 5px;
        }
        .header .disclaimer-badge {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 10px;
            border: 2px solid #fbbf24;
        }
        ${
          includePersonal
            ? `
        .user-info {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 40px;
        }
        .user-info h2 {
            color: #1f2937;
            margin-bottom: 20px;
            font-size: 24px;
            border-bottom: 2px solid #d1d5db;
            padding-bottom: 10px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        .info-item {
            padding: 15px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .info-item strong {
            color: #6b7280;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-item span {
            color: #1f2937;
            font-size: 16px;
        }`
            : ""
        }
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        .section h2 {
            color: #1f2937;
            margin-bottom: 20px;
            font-size: 24px;
            border-bottom: 2px solid #d1d5db;
            padding-bottom: 10px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, #64748b 0%, #475569 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .stat-card .value {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .stat-card .label {
            font-size: 14px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .chart-container {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }
        .chart-title {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .bar-chart {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .bar-item {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .bar-label {
            width: 100px;
            font-weight: 500;
            color: #4b5563;
            font-size: 14px;
        }
        .bar-container {
            flex: 1;
            height: 32px;
            background: #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
            position: relative;
        }
        .bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #64748b 0%, #475569 100%);
            display: flex;
            align-items: center;
            padding-left: 10px;
            color: white;
            font-weight: 600;
            font-size: 12px;
            transition: width 0.3s ease;
        }
        .bar-value {
            width: 60px;
            text-align: right;
            font-weight: 600;
            color: #1f2937;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        thead {
            background: #64748b;
            color: white;
        }
        th, td {
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
        }
        tbody tr:hover {
            background: #f9fafb;
        }
        tbody tr:last-child td {
            border-bottom: none;
        }
        .mood-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
        }
        .mood-5 { background: #10b981; color: white; }
        .mood-4 { background: #64748b; color: white; }
        .mood-3 { background: #f59e0b; color: white; }
        .mood-2 { background: #ef4444; color: white; }
        .mood-1 { background: #dc2626; color: white; }
        .disclaimer {
            background: #fef3c7;
            border: 2px solid #fbbf24;
            border-radius: 12px;
            padding: 20px;
            margin-top: 40px;
        }
        .disclaimer h3 {
            color: #92400e;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: 700;
        }
        .disclaimer p {
            color: #78350f;
            font-size: 14px;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
            line-height: 1.8;
        }
        @media print {
            body { padding: 20px; }
            .stat-card { break-inside: avoid; }
            .chart-container { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <!-- Updated header with non-clinical language -->
    <div class="header">
        <h1>Personal Wellness Summary</h1>
        <p class="subtitle">${periodText} Summary • Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div class="disclaimer-badge">SELF-REPORTED WELLNESS DATA</div>
        <p style="margin-top: 15px; font-size: 14px; color: #6b7280;">User ID: MH-USER-${userIdShort} • For Personal/Trained Professional Review</p>
    </div>

    ${
      includePersonal
        ? `
    <!-- Updated section title to non-clinical language -->
    <div class="user-info">
        <h2>User Profile Summary</h2>
        <div class="info-grid">
            <div class="info-item">
                <strong>Full Name</strong>
                <span>${userData?.name || "Not provided"}</span>
            </div>
            <div class="info-item">
                <strong>Email</strong>
                <span>${userData?.email || "Not provided"}</span>
            </div>
            <div class="info-item">
                <strong>Phone</strong>
                <span>${profile.phone || "Not provided"}</span>
            </div>
            <div class="info-item">
                <strong>Date of Birth</strong>
                <span>${profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not provided"}</span>
            </div>
            <div class="info-item">
                <strong>Gender</strong>
                <span>${profile.gender || "Not provided"}</span>
            </div>
            <div class="info-item">
                <strong>Address</strong>
                <span>${profile.address || "Not provided"}</span>
            </div>
            <div class="info-item">
                <strong>Emergency Contact</strong>
                <span>${profile.emergencyContact || "Not provided"}</span>
            </div>
            <div class="info-item">
                <strong>Therapist</strong>
                <span>${profile.therapistName || "Not assigned"}</span>
            </div>
            ${
              profile.therapistContact
                ? `
            <div class="info-item">
                <strong>Therapist Contact</strong>
                <span>${profile.therapistContact}</span>
            </div>
            `
                : ""
            }
            ${
              profile.medicalHistory
                ? `
            <div class="info-item" style="grid-column: 1 / -1;">
                <strong>Medical History</strong>
                <span>${profile.medicalHistory}</span>
            </div>
            `
                : ""
            }
        </div>
    </div>
    `
        : `
    <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 40px; text-align: center;">
        <p style="color: #6b7280; font-size: 14px;">
            <strong>Privacy Protected:</strong> Personal identifying information excluded from this report. User ID: MH-USER-${userIdShort}
        </p>
    </div>
    `
    }

    <!-- All section content remains the same, just using neutral colors -->
    <div class="section">
        <h2>Summary Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="value">${avgMood}</div>
                <div class="label">Average Mood</div>
            </div>
            <div class="stat-card">
                <div class="value">${moods.length}</div>
                <div class="label">Mood Entries</div>
            </div>
            <div class="stat-card">
                <div class="value">${journals.length}</div>
                <div class="label">Journal Entries</div>
            </div>
        </div>
    </div>

    <!-- Updated section title to non-clinical language -->
    <div class="section">
        <h2>Pattern Summary</h2>
        <div class="chart-container">
            <div class="chart-title">Mood Rating Breakdown (${periodText})</div>
            <div class="bar-chart">
                <div class="bar-item">
                    <div class="bar-label">Excellent (5)</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(moodDistribution.excellent / totalPercentage) * 100}%">
                            ${moodDistribution.excellent > 0 ? `${((moodDistribution.excellent / totalPercentage) * 100).toFixed(0)}%` : ""}
                        </div>
                    </div>
                    <div class="bar-value">${moodDistribution.excellent}</div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Good (4)</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(moodDistribution.good / totalPercentage) * 100}%">
                            ${moodDistribution.good > 0 ? `${((moodDistribution.good / totalPercentage) * 100).toFixed(0)}%` : ""}
                        </div>
                    </div>
                    <div class="bar-value">${moodDistribution.good}</div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Neutral (3)</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(moodDistribution.neutral / totalPercentage) * 100}%">
                            ${moodDistribution.neutral > 0 ? `${((moodDistribution.neutral / totalPercentage) * 100).toFixed(0)}%` : ""}
                        </div>
                    </div>
                    <div class="bar-value">${moodDistribution.neutral}</div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Low (2)</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(moodDistribution.low / totalPercentage) * 100}%">
                            ${moodDistribution.low > 0 ? `${((moodDistribution.low / totalPercentage) * 100).toFixed(0)}%` : ""}
                        </div>
                    </div>
                    <div class="bar-value">${moodDistribution.low}</div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Poor (1)</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${(moodDistribution.poor / totalPercentage) * 100}%">
                            ${moodDistribution.poor > 0 ? `${((moodDistribution.poor / totalPercentage) * 100).toFixed(0)}%` : ""}
                        </div>
                    </div>
                    <div class="bar-value">${moodDistribution.poor}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Detailed Mood Log</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Mood Rating</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                ${
                  moods.length > 0
                    ? moods
                        .map(
                          (mood) => `
                    <tr>
                        <td>${new Date(mood.date).toLocaleDateString()}</td>
                        <td>${new Date(mood.date).toLocaleTimeString()}</td>
                        <td>
                            <span class="mood-badge mood-${Math.round(mood.mood)}">
                                ${mood.mood.toFixed(1)} / 5
                            </span>
                        </td>
                        <td>${mood.notes || "No notes"}</td>
                    </tr>
                `,
                        )
                        .join("")
                    : `
                    <tr>
                        <td colspan="4" style="text-align: center; color: #6b7280;">No mood entries recorded for this period</td>
                    </tr>
                `
                }
            </tbody>
        </table>
    </div>

    ${
      journals.length > 0
        ? `
    <div class="section">
        <h2>Journal Entries</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Content Preview</th>
                </tr>
            </thead>
            <tbody>
                ${journals
                  .map(
                    (journal) => `
                    <tr>
                        <td>${new Date(journal.date).toLocaleDateString()}</td>
                        <td>${journal.title || "Untitled"}</td>
                        <td>${journal.content ? journal.content.substring(0, 100) + (journal.content.length > 100 ? "..." : "") : "No content"}</td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    </div>
    `
        : ""
    }

    <!-- Updated disclaimer with non-clinical language -->
    <div class="disclaimer">
        <h3>⚠️ Important Disclaimer</h3>
        <p>
            This is self-reported data for personal reflection and professional discussion only. Not a medical diagnosis or diagnostic instrument. 
            The information presented reflects personal wellness tracking and should not be used as a substitute for professional medical advice, 
            diagnosis, or treatment. Always consult a qualified healthcare professional for clinical advice. This data belongs to the user and 
            is provided for personal use or to share with trained professionals at the user's discretion.
        </p>
    </div>

    <!-- Updated footer disclaimer -->
    <div class="footer">
        <p><strong>This is self-reported data for personal reflection and professional discussion only.</strong></p>
        <p>Not a medical diagnosis. Consult qualified professional for clinical advice.</p>
        <p style="margin-top: 15px;">Generated by Mindora Wellness Platform</p>
        <p>Report Period: ${periodText} • Generated: ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
  `
}
