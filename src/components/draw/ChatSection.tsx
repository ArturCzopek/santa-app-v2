import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ChatMessage, CHAT_MESSAGE_MAX_LENGTH } from '../../models/Draw';
import { chatService } from '../../services/ChatService';
import { useNotify } from '../../hooks/useNotify';
import PaperCard from '../common/PaperCard';
import SectionHeading from './SectionHeading';
import { tokens } from '../../styles/theme';

interface ChatSectionProps {
  drawId: string;
  // The chat belongs to the recipient; the Santa's own id is never stored.
  recipientUid: string;
  role: ChatMessage['from'];
  // The recipient's name, shown to the Santa only.
  otherName?: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  drawId,
  recipientUid,
  role,
  otherName = '',
}) => {
  const { t } = useTranslation();
  const notify = useNotify();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return chatService.subscribe(drawId, recipientUid, setMessages, (error) => {
      console.error('Error loading chat:', error);
      notify(t('drawPage.winnerSection.chat.loadFailed'));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawId, recipientUid]);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'nearest' });
  }, [messages.length]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);
    try {
      await chatService.send(drawId, recipientUid, role, trimmed);
      setText('');
    } catch (error) {
      console.error('Error sending chat message:', error);
      notify(t('drawPage.winnerSection.chat.sendFailed'));
    } finally {
      setSending(false);
    }
  };

  const title =
    role === 'santa'
      ? t('drawPage.winnerSection.chat.titleSanta', { name: otherName })
      : t('drawPage.winnerSection.chat.titleRecipient');

  return (
    <Box component="section" sx={{ mt: 4 }} aria-label={title}>
      <SectionHeading>{title}</SectionHeading>
      <PaperCard onSubmit={handleSend}>
        <Typography variant="body2" color="text.secondary">
          {role === 'santa'
            ? t('drawPage.winnerSection.chat.helperSanta', { name: otherName })
            : t('drawPage.winnerSection.chat.helperRecipient')}
        </Typography>
        <Box
          role="log"
          aria-live="polite"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxHeight: 320,
            overflowY: 'auto',
          }}
        >
          {messages.length === 0 && (
            <Typography color="text.secondary">
              {t('drawPage.winnerSection.chat.empty')}
            </Typography>
          )}
          {messages.map((message) => {
            const mine = message.from === role;
            return (
              <Box
                key={message.id}
                sx={{
                  alignSelf: mine ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  border: `1px solid ${tokens.paperLine}`,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {mine
                    ? t('drawPage.winnerSection.chat.you')
                    : message.from === 'santa'
                      ? t('drawPage.winnerSection.chat.santa')
                      : otherName}
                </Typography>
                <Typography
                  sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                >
                  {message.text}
                </Typography>
              </Box>
            );
          })}
          <div ref={endRef} />
        </Box>
        <TextField
          label={t('drawPage.winnerSection.chat.label')}
          multiline
          minRows={2}
          value={text}
          onChange={(event) => setText(event.target.value)}
          fullWidth
          helperText={`${text.length} / ${CHAT_MESSAGE_MAX_LENGTH}`}
          slotProps={{ htmlInput: { maxLength: CHAT_MESSAGE_MAX_LENGTH } }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="outlined"
            color="inherit"
            disabled={sending || text.trim() === ''}
            sx={{ color: tokens.ink }}
          >
            {t('drawPage.winnerSection.chat.send')}
          </Button>
        </Box>
      </PaperCard>
    </Box>
  );
};

export default ChatSection;
