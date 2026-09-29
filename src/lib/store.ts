import fs from "fs";
import path from "path";
import type { Branch, Owner } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "owners.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readAll(): Owner[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Owner[];
    return [];
  } catch {
    return [];
  }
}

function writeAll(owners: Owner[]): void {
  ensureDir(DATA_DIR);
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(owners, null, 2), "utf8");
  fs.renameSync(tmp, DATA_FILE);
}

export function getOwners(): Owner[] {
  return readAll();
}

export function getOwnerById(id: string): Owner | undefined {
  return readAll().find((o) => o.id === id);
}

export function getOwnerByEmail(email: string): Owner | undefined {
  const e = email.trim().toLowerCase();
  return readAll().find((o) => o.email.toLowerCase() === e);
}

export function getOwnerBySlug(slug: string): Owner | undefined {
  const s = slug.trim().toLowerCase();
  return readAll().find((o) => o.slug.toLowerCase() === s);
}

export function isSlugTaken(slug: string, exceptId?: string): boolean {
  const s = slug.trim().toLowerCase();
  return readAll().some((o) => o.slug.toLowerCase() === s && o.id !== exceptId);
}

export function isEmailTaken(email: string, exceptId?: string): boolean {
  const e = email.trim().toLowerCase();
  return readAll().some((o) => o.email.toLowerCase() === e && o.id !== exceptId);
}

export function saveOwner(owner: Owner): Owner {
  const owners = readAll();
  const idx = owners.findIndex((o) => o.id === owner.id);
  if (idx >= 0) owners[idx] = owner;
  else owners.push(owner);
  writeAll(owners);
  return owner;
}

export function deleteOwnerById(id: string): boolean {
  const owners = readAll();
  const target = owners.find((o) => o.id === id);
  if (!target) return false;
  const next = owners.filter((o) => o.id !== id);
  writeAll(next);
  const urls = target.branches.flatMap((b) => [...b.images, ...b.videos]);
  removeUploadFiles(urls);
  return true;
}

export function saveBranch(ownerId: string, branch: Branch): Branch | undefined {
  const owner = getOwnerById(ownerId);
  if (!owner) return undefined;
  const idx = owner.branches.findIndex((b) => b.id === branch.id);
  if (idx >= 0) owner.branches[idx] = branch;
  else owner.branches.push(branch);
  owner.updatedAt = new Date().toISOString();
  saveOwner(owner);
  return branch;
}

export function deleteBranch(ownerId: string, branchId: string): boolean {
  const owner = getOwnerById(ownerId);
  if (!owner) return false;
  const target = owner.branches.find((b) => b.id === branchId);
  if (!target) return false;
  owner.branches = owner.branches.filter((b) => b.id !== branchId);
  owner.updatedAt = new Date().toISOString();
  saveOwner(owner);
  removeUploadFiles([...target.images, ...target.videos]);
  return true;
}

export function saveUpload(filename: string, buffer: Buffer): void {
  ensureDir(UPLOAD_DIR);
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
}

export function loadUpload(filename: string): Buffer | null {
  const safe = path.basename(filename);
  const filePath = path.join(UPLOAD_DIR, safe);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

export function removeUpload(filename: string): void {
  const safe = path.basename(filename);
  const filePath = path.join(UPLOAD_DIR, safe);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export function removeUploadFiles(urls: string[]): void {
  for (const url of urls) {
    if (!url) continue;
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    if (filename) removeUpload(filename);
  }
}