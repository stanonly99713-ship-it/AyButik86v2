"use client";

import { useRef } from "react";
import { useActionState } from "react";
import { createCategory, type CategoryFormState } from "@/actions/categories";

const initialState: CategoryFormState = {};

export function AddCategoryForm() {
  const [state, formAction, pending] = useActionState(createCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex gap-2"
    >
      <input
        name="name"
        placeholder="Новая категория"
        required
        className="h-11 flex-1 rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-11 shrink-0 rounded-lg bg-gradient-to-r from-gold to-gold-light px-4 text-sm font-medium text-ink disabled:opacity-60"
      >
        Добавить
      </button>
      {state.error && <p className="text-xs text-red-400">{state.error}</p>}
    </form>
  );
}
