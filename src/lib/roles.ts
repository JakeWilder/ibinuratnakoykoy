export type RoleSlug =
  | "administrator"
  | "suboperator"
  | "master-agent"
  | "sub-agent"
  | "agent"
  | "player"
  | "declarator";

export const ROLES: { slug: RoleSlug; label: string }[] = [
  { slug: "administrator", label: "Administrator" },
  { slug: "suboperator", label: "Suboperator" },
  { slug: "master-agent", label: "Master Agent" },
  { slug: "sub-agent", label: "Sub Agent" },
  { slug: "agent", label: "Agent" },
  { slug: "player", label: "Player" },
  { slug: "declarator", label: "Declarator" },
];

export function isRole(v: string | undefined | null): v is RoleSlug {
  return !!v && ROLES.some(r => r.slug === v);
}
export function labelFor(slug: RoleSlug) {
  return ROLES.find(r => r.slug === slug)!.label;
}
