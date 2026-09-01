import { clsx, type ClassValue } from 'clsx'
import { Parser } from '@json2csv/plainjs'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: string | number | Date) {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(Number(value)))
}

export function exportCSV(data: any, dataFields: string[], methodName: string) {
  const parser = new Parser({ fields: dataFields })
  const csv = parser.parse(data)
  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });
  const dateNow = `${new Date().toISOString().split('T')[0]}_${new Date().getHours()}${new Date().getMinutes()}`

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${methodName}_${dateNow}.csv`;
  link.click();

  URL.revokeObjectURL(url);
  toast.success('下載報表成功')
}