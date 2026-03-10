import { redirect } from "next/navigation"


type Path = "/api/auth/signin" | "/dashboard" | "/"

export const goTo = (path: Path) => redirect(path);