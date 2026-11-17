import { clsx, type ClassValue } from 'clsx'
import { Parser } from '@json2csv/plainjs'
import { twMerge } from 'tailwind-merge'
import { toast } from 'sonner'
import { supabaseClient } from '../../Backend/src/supabaseClient'

export const apiUrl = process.env.NEXT_PUBLIC_API ?? 'http://localhost:4201/graphql'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: string | number | Date | null | undefined) {
  if (value == null) return '—';

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'number') {
    date = new Date(value);
  } else {
    const text = value.trim();
    if (text === '') return '—';

    if (/^\d+$/.test(text)) {
      // 例如 "1794822624877"：先轉成數字，再當毫秒時間戳解析
      date = new Date(Number(text));
    } else {
      // 例如 "2026-11-16 09:50:25.087445+00"：整理成 ISO 格式
      const normalized = text
        .replace(' ', 'T')
        .replace(/(\.\d{3})\d+/, '$1')
        .replace(/(T\d{2}:\d{2}:\d{2}(?:\.\d+)?)([+-]\d{2})$/, '$1$2:00');

      date = new Date(normalized);
    }
  }

  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  }).format(date);
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

export function randomKey() {
  return String(Math.floor(Math.random() * 999999))
}

export const calculatePercentage = (count: number, total: number) => {
  if (total === 0) return 0

  return Number(((count / total) * 100).toFixed(1))
}