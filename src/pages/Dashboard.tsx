import { ChatWindow } from '../components/chat/ChatWindow'
import { TelemetryPanel } from '../components/telemetry/TelemetryPanel'
import { MainLayout } from '../layouts/MainLayout'

export function Dashboard() {
  return (
    <MainLayout>
      <div className="dashboard-main">
        <div className="dashboard-chat-area">
          <ChatWindow />
        </div>
        <div className="dashboard-telemetry-area">
          <TelemetryPanel />
        </div>
      </div>
    </MainLayout>
  )
}
