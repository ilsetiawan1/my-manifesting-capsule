import { Metadata } from "next";
import SettingsClientPage from "./SettingsClientPage";

export const metadata: Metadata = {
  title: "Settings - The Manifesting Capsule",
};

export default function SettingsPage() {
  return <SettingsClientPage />;
}
