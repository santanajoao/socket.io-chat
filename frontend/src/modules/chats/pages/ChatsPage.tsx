import { PageContainer } from "@/modules/shared/components/containers/PageContainer";
import { ChatProvider } from "../contexts/ChatContext";
import { Chat } from "../components/Chat";

// lidar com timezones

export function ChatsPage() {
  return (
    <ChatProvider>
      <PageContainer>
        <Chat />
      </PageContainer>
    </ChatProvider>
  );
}
