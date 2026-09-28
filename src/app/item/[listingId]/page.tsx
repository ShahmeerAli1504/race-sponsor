import { redirect } from 'next/navigation';

export default function LegacyItemPage({ params }: { params: { listingId: string } }) {
  redirect(`/athletes/${params.listingId}`);
}
