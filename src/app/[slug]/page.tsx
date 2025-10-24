import { redirect } from 'next/navigation'

// Default page for /[slug]
// Redirect users to the Dashboard subpage so /kementerian-agama works.
export default function SlugIndexPage({ params }: { params: { slug: string } }) {
  const slug = params?.slug ?? ''
  // Redirect to the Dashboard inside the slug layout
  redirect(`/${encodeURIComponent(slug)}/Dashboard`)
}
