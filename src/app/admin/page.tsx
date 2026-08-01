import { redirect } from "next/navigation";

// Пока в админке есть только раздел "Товары" — редирект без лишнего клика.
// Когда в P4 появятся Категории/Оформление/Контакты, здесь будет дашборд.
export default function AdminIndexPage() {
  redirect("/admin/products");
}
