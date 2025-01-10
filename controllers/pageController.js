import path, { join } from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getHome(req, res) {
  res.sendFile(path.join(__dirname, "../public/html/index.html"));
}

export function getAbout(req, res) {
  res.sendFile(path.join(__dirname, "../public/html/about.html"));
}

export function getContact(req, res) {
  res.sendFile(path.join(__dirname, "../public/html/contact.html"));
}

export function getUserPanel(req, res) {
  res.sendFile(path.join(__dirname, "../public/html/userPanel.html"));
}

export function getRegister(req, res) {
  res.sendFile(path.join(__dirname, "../public/html/register.html"));
}

export function getLogin(req, res) {
  res.sendFile(path.join(__dirname, "../public/html/login.html"));
}

export function get404(req, res) {
  res.sendFile(path.join(__dirname, "../public/html/404.html"));
}
