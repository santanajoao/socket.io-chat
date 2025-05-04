import { ChatProvider } from "@/modules/chats/contexts/ChatContext";
import { ChatsPage } from "@/modules/chats/pages/ChatsPage";

export default function Home() {
  return (
    <ChatProvider>
      <ChatsPage />
    </ChatProvider>
  );
}
