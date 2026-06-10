import type { ManagedUser } from '@/store/api/dashboardOverViewPage/userManagement'

const EXPORT_HEADERS = [
  'Name',
  'Nickname',
  'Email',
  'Gender',
  'Age',
  'Weight (kg)',
  'Role',
  'Verification',
  'Account Status',
  'Created At',
]

function mapUserToExportRow(user: ManagedUser): string[] {
  return [
    user.name,
    user.nickName || 'N/A',
    user.email,
    user.gender || 'N/A',
    user.age ? String(user.age) : 'N/A',
    user.weight ? String(user.weight) : 'N/A',
    user.role,
    user.verified ? 'Verified' : 'Unverified',
    user.isBanned ? 'Banned' : 'Active',
    new Date(user.createdAt).toLocaleDateString(),
  ]
}

function buildExportFilename(extension: 'pdf' | 'xlsx') {
  const stamp = new Date().toISOString().slice(0, 10)
  return `dnx-users-${stamp}.${extension}`
}

export async function exportUsersToExcel(users: ManagedUser[]) {
  const XLSX = await import('xlsx')
  const rows = users.map(mapUserToExportRow)
  const worksheet = XLSX.utils.aoa_to_sheet([EXPORT_HEADERS, ...rows])
  const workbook = XLSX.utils.book_new()

  worksheet['!cols'] = [
    { wch: 22 },
    { wch: 16 },
    { wch: 28 },
    { wch: 10 },
    { wch: 6 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
  XLSX.writeFile(workbook, buildExportFilename('xlsx'))
}

export async function exportUsersToPdf(users: ManagedUser[]) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })

  autoTable(doc, {
    head: [EXPORT_HEADERS],
    body: users.map(mapUserToExportRow),
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
