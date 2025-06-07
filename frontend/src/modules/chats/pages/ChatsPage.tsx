import { PageContainer } from "@/modules/shared/components/containers/PageContainer";
import { ChatProvider } from "../contexts/ChatContext";
import { Chat } from "../components/Chat";

// scroll deve iniciar em baixo
// ao receber mensagem o scroll deve ir para baixo

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
