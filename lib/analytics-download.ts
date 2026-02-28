/**
 * Analytics Download Utility
 * Generates and downloads comprehensive PDF reports of user emotional analytics
 */

interface AnalyticsStats {
  avgMood: number
  allMoods: any[]
  highestMood: number
  lowestMood: number
  moodVariance: number
}

export async function downloadAnalyticsReport(userId: string, stats: AnalyticsStats) {
  try {
    // Create report content
    const reportContent = generateReportHTML(stats)

    // Convert to blob and download
    const blob = new Blob([reportContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `mindora-report-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log("[v0] Report downloaded successfully for user:", userId)
  } catch (error) {
    console.error("[v0] Error downloading report:", error)
    throw error
  }
}

function generateReportHTML(stats: AnalyticsStats): string {
  const reportDate = new Date().toLocaleDateString()
  const highestDay = Math.max(...stats.allMoods.map((m: any) => m.mood)) 
  const lowestDay = Math.min(...stats.allMoods.map((m: any) => m.mood))

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mindora Emotional Intelligence Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
          padding: 40px;
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
        }
        
        header {
          border-bottom: 3px solid #6366f1;
          padding-bottom: 30px;
          margin-bottom: 40px;
        }
        
        h1 {
          font-size: 2.5em;
          color: #1f2937;
          margin-bottom: 10px;
        }
        
        .report-info {
          color: #6b7280;
          font-size: 0.95em;
        }
        
        .report-info p {
          margin: 5px 0;
        }
        
        section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        
        h2 {
          font-size: 1.5em;
          color: #1f2937;
          margin-bottom: 20px;
          border-left: 4px solid #6366f1;
          padding-left: 15px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        
        .stat-label {
          color: #6b7280;
          font-size: 0.9em;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-value {
          font-size: 2.5em;
          font-weight: bold;
          color: #6366f1;
        }
        
        .insight-box {
          background: #f0f4ff;
          border-left: 4px solid #6366f1;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        
        .insight-title {
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 5px;
        }
        
        .insight-text {
          color: #4b5563;
          font-size: 0.95em;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        th {
          background: #f3f4f6;
          font-weight: 600;
          color: #1f2937;
        }
        
        tr:hover {
          background: #f9fafb;
        }
        
        .footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
          margin-top: 40px;
          color: #9ca3af;
          font-size: 0.85em;
          text-align: center;
        }
        
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85em;
          font-weight: 500;
        }
        
        .badge-high {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .badge-medium {
          background: #fef3c7;
          color: #92400e;
        }
        
        .badge-good {
          background: #dcfce7;
          color: #166534;
        }
        
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>Emotional Intelligence Report</h1>
          <div class="report-info">
            <p><strong>Report Date:</strong> ${reportDate}</p>
            <p><strong>Analysis Period:</strong> Last 30 days</p>
            <p><strong>Report Type:</strong> Personal Analytics & Insights</p>
          </div>
        </header>
        
        <section>
          <h2>📊 Your Emotional Analytics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Average Mood</div>
              <div class="stat-value">${stats.avgMood}/10</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Entries</div>
              <div class="stat-value">${stats.allMoods.length}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Peak Mood</div>
              <div class="stat-value">${stats.highestMood}/10</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Stability Score</div>
              <div class="stat-value">${10 - Math.round(stats.moodVariance)}/10</div>
            </div>
          </div>
        </section>
        
        <section>
          <h2>💡 Key Insights</h2>
          <div class="insight-box">
            <div class="insight-title">Emotional Consistency</div>
            <div class="insight-text">
              Your mood entries show a stability score of ${10 - Math.round(stats.moodVariance)}/10, indicating ${10 - Math.round(stats.moodVariance) > 7 ? "strong emotional consistency" : "moderate emotional volatility"}. 
            </div>
          </div>
          <div class="insight-box">
            <div class="insight-title">Engagement Level</div>
            <div class="insight-text">
              With ${stats.allMoods.length} entries tracked over the past month, you're demonstrating strong commitment to your emotional wellness journey.
            </div>
          </div>
          <div class="insight-box">
            <div class="insight-title">Mood Range</div>
            <div class="insight-text">
              Your mood ranges from ${stats.lowestMood}/10 to ${stats.highestMood}/10, with a variance of ${Math.round(stats.moodVariance)} points, showing ${stats.moodVariance > 5 ? "notable emotional fluctuations" : "stable emotional patterns"}.
            </div>
          </div>
        </section>
        
        <section>
          <h2>📈 Trends & Patterns</h2>
          <p style="color: #6b7280; margin-bottom: 15px;">
            Based on your tracking data, here are the key trends identified:
          </p>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Status</th>
                <th>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Average Mood Score</td>
                <td><span class="badge badge-${stats.avgMood > 7 ? "good" : stats.avgMood > 5 ? "medium" : "high"}">
                  ${stats.avgMood > 7 ? "Positive" : stats.avgMood > 5 ? "Neutral" : "Concerning"}
                </span></td>
                <td>${stats.avgMood > 7 ? "Generally positive emotional state" : stats.avgMood > 5 ? "Mixed emotional patterns" : "May benefit from additional support"}</td>
              </tr>
              <tr>
                <td>Emotional Stability</td>
                <td><span class="badge badge-${10 - Math.round(stats.moodVariance) > 7 ? "good" : "medium"}">
                  ${10 - Math.round(stats.moodVariance) > 7 ? "Stable" : "Moderate"}
                </span></td>
                <td>${10 - Math.round(stats.moodVariance) > 7 ? "Consistent mood levels throughout the month" : "Some emotional fluctuations observed"}</td>
              </tr>
              <tr>
                <td>Tracking Consistency</td>
                <td><span class="badge badge-good">Active</span></td>
                <td>Regular engagement with mood tracking supports self-awareness</td>
              </tr>
            </tbody>
          </table>
        </section>
        
        <section>
          <h2>🎯 Recommendations</h2>
          <ul style="margin-left: 20px; line-height: 1.8;">
            <li>Continue tracking your mood daily to maintain awareness of emotional patterns</li>
            <li>Use journaling alongside mood tracking to identify triggers and causes</li>
            <li>Practice the breathing exercises to manage emotional peaks and valleys</li>
            <li>${stats.avgMood > 7 ? "Maintain your current wellness habits as they're working well" : "Consider increasing your engagement with wellness exercises"}</li>
            <li>Review this report monthly to track your emotional growth over time</li>
          </ul>
        </section>
        
        <div class="footer">
          <p>This report was generated by Mindora - Your Emotional Intelligence Analytics Platform</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p style="margin-top: 10px; color: #d1d5db;">
            Note: This report is for personal use. Please keep it confidential as it contains sensitive emotional data.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
