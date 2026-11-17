"use client"

import { useState } from "react"
import { cases } from "@/lib/data"
import { FilterBar } from "@/components/filter-bar"
import { CaseGrid } from "@/components/case-grid"
import { SectionTitle } from "@/components/section-title"

export function AllCasesSection() {
  const [query, setQuery] = useState("")
  const filtered = query
    ? cases.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : cases

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4">
      <SectionTitle title="Все кейсы" mascot />
      <FilterBar query={query} onQueryChange={setQuery} />
      <CaseGrid items={filtered} />
    </section>
  )
}
