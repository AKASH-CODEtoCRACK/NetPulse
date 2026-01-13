import { CyberLoader } from "./components/shared/CyberLoader";

export default function Loading() {
  return <CyberLoader fullscreen={true} text="ACCESSING NODE..." />;
}