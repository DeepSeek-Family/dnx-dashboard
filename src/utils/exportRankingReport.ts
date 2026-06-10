export interface RankingExportEntry {
  rank?: number
  level?: number
  totalSteps?: number
  totalWorkoutDays?: number
  totalDNXScore?: number
  user?: {
    name?: string
    nickName?: string
    gym?: {
      gymName?: string
      country?: string
      city?: string
      state?: string
    }
  }
}

const EXPORT_HEADERS = [
  'Rank',
  'Athlete',
  'Username',
  'Level',
  'Steps',
  'Workout Days',
  'Gym Name',
  'Country',
  'City',
  'State',
  'DNX Score',
  'Status',
]

function mapRankingToExportRow(entry: RankingExportEntry): string[] {
  return [
    entry.rank != null ? String(entry.rank) : '-',
    entry.user?.name || '-',
    entry.user?.nickName ? `@${entry.user.nickName}` : '-',
    entry.level != null ? String(entry.level) : '-',
    entry.totalSteps != null ? String(entry.totalSteps) : '-',
    entry.totalWorkoutDays != null ? String(entry.totalWorkoutDays) : '-',
    entry.user?.gym?.gymName || '-',
    entry.user?.gym?.country || '-',
    entry.user?.gym?.city || '-',
    entry.user?.gym?.state || '-',
    entry.totalDNXScore != null ? entry.totalDNXScore.toFixed(1) : '0',
    'Active',
  ]
}

function buildExportFilename(extension: 'pdf' | 'xlsx') {
  return `DNX-Live-Ranking.${extension}`
}

export async function exportRankingsToExcel(entries: RankingExportEntry[]) {
  const XLSX = await import('xlsx')
  const rows = entries.map(mapRankingToExportRow)
  const worksheet = XLSX.utils.aoa_to_sheet([EXPORT_HEADERS, ...rows])
  const workbook = XLSX.utils.book_new()

  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 22 },
    { wch: 18 },
    { wch: 8 },
    { wch: 10 },
    { wch: 14 },
    { wch: 22 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 10 },
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Live Ranking')
  XLSX.writeFile(workbook, buildExportFilename('xlsx'))
}

export async function exportRankingsToPdf(entries: RankingExportEntry[]) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })

  doc.setFontSize(14)
  doc.text('DNX Live Ranking', 40, 28)

  autoTable(doc, {
    head: [EXPORT_HEADERS],
    body: entries.map(mapRankingToExportRow),
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [255, 214, 0],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    margin: { left: 40, right: 40 },
  })

  doc.save(buildExportFilename('pdf'))
}
