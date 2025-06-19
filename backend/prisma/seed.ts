import { PrismaClient } from 'generated/prisma';
import { CHAT_TYPE } from 'src/chats/models/chat.model';
import { GROUP_TYPE } from 'src/chats/models/group-chat.model';
import { MESSAGE_TYPE } from 'src/messages/models/message.model';

async function seeder() {
  const prisma = new PrismaClient();

  const globalGroups = [
    {
      chatId: '980e8091-96e6-4c6b-8fd9-78263e4e55e7',
      groupChatId: 'ea5aa406-72d9-46a7-8399-6287aacc34a4',
      title: 'Global',
      groupType: GROUP_TYPE.GLOBAL,
      chatType: CHAT_TYPE.GROUP,
      createMessageId: '2c98e527-b0de-4503-9857-c967987dc711',
    },
    {
      chatId: '8884c664-82d9-4ae2-800d-16ae277aa73f',
      groupChatId: 'c5bb9653-2022-4b17-83ec-77c4706cb3a8',
      title: 'Software',
      groupType: GROUP_TYPE.GLOBAL,
      chatType: CHAT_TYPE.GROUP,
      createMessageId: '7023cfe4-36fa-4341-a3f3-4e9428f96347',
    },
    {
      chatId: 'c2b02c7f-c970-4a98-bff0-25e1e2888b14',
      groupChatId: 'c2e0fca5-5437-4232-85fe-f695bdcddb39',
      title: 'Games',
      groupType: GROUP_TYPE.GLOBAL,
      chatType: CHAT_TYPE.GROUP,
      createMessageId: '982f5d33-f5d6-4e3b-aa20-0c13b4e0a9d7',
    },
  ];

  await prisma.$transaction(async (transactionClient) => {
    for (const globalGroup of globalGroups) {
      await transactionClient.chat.upsert({
        create: {
          type: globalGroup.chatType,
          id: globalGroup.chatId,
        },
        update: {},
        where: {
          id: globalGroup.chatId,
        },
      });

      await transactionClient.groupChat.upsert({
        create: {
          title: globalGroup.title,
          groupType: globalGroup.groupType,
          chatId: globalGroup.chatId,
          id: globalGroup.groupChatId,
        },
        update: {},
        where: {
          id: globalGroup.groupChatId,
        },
      });

      await transactionClient.message.upsert({
        create: {
          id: globalGroup.createMessageId,
          type: MESSAGE_TYPE.GLOBAL_GROUP,
          chatId: globalGroup.chatId,
        },
        update: {},
        where: {
          id: globalGroup.createMessageId,
        },
      })
    }
  });
}

seeder()
  .then(() => console.log('Seeding completed'))
  .catch((error) => {
    console.error('Error seeding: \n', error);
  });
