'use client';

import { PageContainer } from "@/modules/shared/components/containers/PageContainer";
import { ChatList } from "../components/ChatList";
import { ChatMessages } from "../components/ChatMessages";

// loading skeletton nos chats
// loading skelleton nas mensagens

// caso já estiver com o chat aberto, cada mensagem que chegar tem que ser marcada como lida

// auth context
// se eu mandei a mensagem renderizar no lado certo
// se eu mandei a mensagem mostrar "eu" ao invés do username

// scroll deve iniciar em baixo
// ao receber mensagem o scroll deve ir para baixo

// header de usuário e ações em cima do chat list

// lidar com timezones

export function ChatsPage() {
  return (
    <PageContainer>
      <div className="flex flex-1 w-full gap-0.5 overflow-hidden">
        <ChatList />

        <ChatMessages />
      </div>
    </PageContainer>
  );
}
