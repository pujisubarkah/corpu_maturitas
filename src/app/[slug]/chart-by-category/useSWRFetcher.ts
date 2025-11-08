import useSWR from 'swr';

export const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useSummaryKategori(page: number, limit: number) {
  return useSWR(`/api/summary_kategori?page=${page}&limit=${limit}`, fetcher, { revalidateOnFocus: false });
}

export function useUserList() {
  return useSWR('/api/user?limit=1000', fetcher, { revalidateOnFocus: false });
}

export function useVerifikasi() {
  return useSWR('/api/verifikasi', fetcher, { revalidateOnFocus: false });
}
