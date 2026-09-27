import React, { useEffect, useState } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { MessageDocument } from '../models/Message';
import { messageService } from '../services/MessageService';
import { useNotify } from '../hooks/useNotify';
import MainLayout from '../components/layout/MainLayout';
import PaperCard from '../components/common/PaperCard';
import { tokens } from '../styles/theme';

const AdminMessagesPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const notify = useNotify();
  const [messages, setMessages] = useState<MessageDocument[]>([]);
  const [lastDocument, setLastDocument] = useState<
    QueryDocumentSnapshot | undefined
  >();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    messageService
      .getMessages()
      .then((page) => {
        setMessages(page.messages);
        setLastDocument(page.lastDocument);
        setHasMore(page.hasMore);
      })
      .catch((error: unknown) => {
        console.error('Error fetching messages:', error);
        setLoadFailed(true);
        notify(t('adminMessages.errors.loadFailed'));
      })
      .finally(() => setLoading(false));
  }, [notify, t]);

  const loadOlder = async () => {
    if (!lastDocument || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await messageService.getMessages(20, lastDocument);
      setMessages((current) => [...current, ...page.messages]);
      setLastDocument(page.lastDocument);
      setHasMore(page.hasMore);
    } catch (error) {
      console.error('Error fetching older messages:', error);
      notify(t('adminMessages.errors.loadFailed'));
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <MainLayout title={t('adminMessages.title')}>
      <Button
        color="inherit"
        startIcon={<ArrowBack />}
        onClick={() => navigate('/draws')}
        sx={{ ml: -1.5, mb: 2, color: tokens.snowMuted }}
      >
        {t('common.backToDraws')}
      </Button>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress color="inherit" aria-label={t('common.loading')} />
        </Box>
      )}

      {!loading && !loadFailed && messages.length === 0 && (
        <PaperCard>
          <Typography>{t('adminMessages.empty')}</Typography>
        </PaperCard>
      )}

      {messages.length > 0 && (
        <>
          <Box
            component="ul"
            sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 2.5 }}
          >
            {messages.map((message) => {
              const date = message.date.toDate();
              return (
                <Box component="li" key={message.id}>
                  <PaperCard component="article" sx={{ gap: 1.25 }}>
                    <Box>
                      <Typography variant="h2" sx={{ fontSize: '1.2rem' }}>
                        {message.userName}
                      </Typography>
                      <Typography
                        component="time"
                        dateTime={date.toISOString()}
                        variant="body2"
                        sx={{ color: tokens.inkMuted }}
                      >
                        {new Intl.DateTimeFormat(
                          i18n.language === 'pl' ? 'pl-PL' : 'en-GB',
                          { dateStyle: 'long', timeStyle: 'short' },
                        ).format(date)}
                      </Typography>
                    </Box>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.message}
                    </Typography>
                  </PaperCard>
                </Box>
              );
            })}
          </Box>
          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                color="inherit"
                disabled={loadingMore}
                onClick={loadOlder}
                sx={{ color: tokens.snow }}
              >
                {t('adminMessages.showOlder')}
              </Button>
            </Box>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default AdminMessagesPage;
