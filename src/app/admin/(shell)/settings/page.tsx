import type { Metadata } from "next";
import { ContactsForm } from "@/components/admin/ContactsForm";
import { getSettings } from "@/db/queries";

export const metadata: Metadata = { title: "Контакты" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="px-4 py-4 pb-24">
      <h1 className="mb-3 text-xl text-cream">Контакты</h1>
      <ContactsForm settings={settings} />
    </div>
  );
}
