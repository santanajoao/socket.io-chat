import { PageContainer } from "@/modules/shared/components/containers/PageContainer";
import { ChatList } from "../components/ChatList";
import { ChatMessages } from "../components/ChatMessages";
import { ChatProvider } from "../contexts/ChatContext";

// loading skeletton nos chats
// loading skelleton nas mensagens

// scroll deve iniciar em baixo
// ao receber mensagem o scroll deve ir para baixo

// lidar com timezones

export function ChatsPage() {
  return (
    <ChatProvider>
      <PageContainer>
        <div className="flex flex-1 w-full gap-0.5 overflow-hidden">
          <ChatList />

          <ChatMessages />
        </div>
      </PageContainer>
    </ChatProvider>
  );
}
