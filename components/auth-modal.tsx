"use client"

import Image from "next/image"
import { useState } from "react"
import { X, Eye, EyeOff, Ticket, Gift, ShieldAlert } from "lucide-react"
import { useUI } from "@/components/ui-provider"

export function AuthModal() {
  const { authOpen: open, closeAuth: onClose } = useUI()
  const [showPass, setShowPass] = useState(false)
  const [loginVal, setLoginVal] = useState("admin")
  const [passVal, setPassVal] = useState("admin")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  const handleAdminLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: loginVal, password: passVal }),
      })
      const data = await res.json()
      if (data.success) {
        window.location.href = "/admin"
      } else {
        setError(data.error || "Ошибка авторизации")
      }
    } catch (err) {
      setError("Ошибка соединения с сервером")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-card md:grid-cols-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: mascot */}
        <div className="relative hidden min-h-[420px] flex-col justify-end p-6 md:flex">
          <Image src="/boss-hazmat.png" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <div className="relative z-10">
            <h3 className="text-2xl font-extrabold leading-tight text-balance">
              Зарегистрируйся и получи бонус!
            </h3>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-background/70 px-4 py-2.5 text-sm font-semibold text-[#b2ff00]">
              <Gift className="h-4 w-4 text-[#b2ff00]" />
              Super Admin Owner Доступ
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="relative p-7">
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <h2 className="text-2xl font-extrabold">
            Войдите <span className="text-muted-foreground">как</span>
          </h2>
          <span className="text-2xl font-extrabold text-[#b2ff00]">
            Super Admin Owner
          </span>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs font-bold text-red-400">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAdminLogin()
            }}
            className="mt-4 space-y-3"
          >
            <div>
              <label className="text-[11px] font-bold text-white/50 mb-1 block">Логин / Email</label>
              <input
                type="text"
                value={loginVal}
                onChange={(e) => setLoginVal(e.target.value)}
                placeholder="admin"
                className="w-full rounded-xl bg-input px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#b2ff00]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-white/50 mb-1 block">Пароль</label>
              <div className="flex items-center rounded-xl bg-input pr-3 focus-within:ring-1 focus-within:ring-[#b2ff00]">
                <input
                  type={showPass ? "text" : "password"}
                  value={passVal}
                  onChange={(e) => setPassVal(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label="Показать пароль"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-[#b2ff00] py-3.5 text-sm font-bold text-[#181614] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Авторизация..." : "Войти как Super Admin Owner"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            или быстрая авторизация
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAdminLogin}
              className="flex items-center justify-center gap-2 rounded-xl bg-input py-3 text-xs font-bold hover:bg-secondary text-white"
            >
              <SteamIcon />
              Steam Owner
            </button>
            <button
              type="button"
              onClick={handleAdminLogin}
              className="flex items-center justify-center gap-2 rounded-xl bg-input py-3 text-xs font-bold hover:bg-secondary text-white"
            >
              <GoogleIcon />
              Google Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SteamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.6 0 .4 4.9.02 11.1l6.45 2.67a3.4 3.4 0 0 1 1.9-.59h.17l2.87-4.15v-.06a4.54 4.54 0 1 1 4.54 4.54h-.1l-4.09 2.92v.14a3.42 3.42 0 1 1-6.8-.5L.4 14.62A12 12 0 1 0 12 0Zm-4.4 18.2 1.47.6a2.56 2.56 0 1 0 1.5-3.35l1.52.63a1.89 1.89 0 1 1-1.45 3.48l-3.04-1.26.01-.1Zm11.5-9.66a3.03 3.03 0 1 0-6.05 0 3.03 3.03 0 0 0 6.05 0Zm-5.3 0a2.27 2.27 0 1 1 4.54 0 2.27 2.27 0 0 1-4.54 0Z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97.2 12 .2a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"
      />
    </svg>
  )
}
