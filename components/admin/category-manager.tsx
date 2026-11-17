"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Trash2, Plus, FolderTree } from "lucide-react"
import { createCategory, deleteCategory } from "@/app/admin/cases/actions"

type Category = {
  id: number
  name: string
  imageUrl: string | null
  caseCount: number
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Create form */}
      <form
        action={(fd) => {
          setError(null)
          startTransition(async () => {
            try {
              await createCategory(fd)
              const form = document.getElementById("cat-form") as HTMLFormElement | null
              form?.reset()
            } catch (e) {
              setError(e instanceof Error ? e.message : "Ошибка")
            }
          })
        }}
        id="cat-form"
        className="h-fit space-y-3 rounded-2xl border border-white/8 bg-card p-5"
      >
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Plus className="h-4 w-4 text-primary" /> Новая категория
        </h3>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Название</label>
          <input
            name="name"
            required
            placeholder="Например: Оружие"
            className="w-full rounded-lg bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Картинка (URL или PNG)
          </label>
          <input
            name="imageUrl"
            placeholder="https://... или /images/cat.png"
            className="w-full rounded-lg bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button
          disabled={pending}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {pending ? "Создаём…" : "Создать категорию"}
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {categories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-muted-foreground">
            Пока нет категорий
          </div>
        )}
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-4 rounded-xl border border-white/8 bg-card p-4"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-secondary">
              {c.imageUrl ? (
                <Image
                  src={c.imageUrl || "/placeholder.svg"}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 object-cover"
                />
              ) : (
                <FolderTree className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.caseCount} кейсов</div>
            </div>
            <button
              onClick={() =>
                startTransition(async () => {
                  await deleteCategory(c.id)
                })
              }
              disabled={pending}
              aria-label="Удалить"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:border-destructive/50 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
