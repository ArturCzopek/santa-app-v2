import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowBack,
  DeleteOutlined,
  Edit,
  EditOutlined,
  KeyOutlined,
  Campaign,
  Logout,
  PlayArrow,
  PersonAdd,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import DrawHeader from '../components/draw/DrawHeader';
import ParticipantsSection from '../components/draw/ParticipantsSection';
import WinnerSection from '../components/draw/WinnerSection';
import StartDrawModal from '../components/draw/StartDrawModal';
import InviteDrawModal from '../components/draw/InviteDrawModal';
import DrawDoneModal from '../components/draw/DrawDoneModal';
import DrawStatus from '../components/draw/DrawStatus';
import EditDrawModal from '../components/draw/EditDrawModal';
import SetPasswordModal from '../components/draw/SetPasswordModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ExclusionsSection, {
  currentExclusions,
  EXCLUSIONS_SECTION_ID,
} from '../components/draw/ExclusionsSection';
import { Exclusion } from '../services/pairs';
import DrawOptionsMenu, {
  DrawOption,
} from '../components/draw/DrawOptionsMenu';
import { drawService } from '../services/DrawService';
import { Draw, Participant } from '../models/Draw';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotify';
import UserWishSection from '../components/draw/UserWishSection';
import { drawingService } from '../services/DrawingService';
import { tokens } from '../styles/theme';

const BackToDraws = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
      color="inherit"
      startIcon={<ArrowBack />}
      onClick={() => navigate('/draws')}
      sx={{ alignSelf: 'flex-start', ml: -1.5, color: tokens.snowMuted }}
    >
      {t('common.backToDraws')}
    </Button>
  );
};

const DrawPage = () => {
  const { drawId } = useParams<{ drawId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const notify = useNotify();
  const location = useLocation();
  const navigationState = location.state as {
    // Set by the join and create pages: the letter editor opens.
    justJoined?: boolean;
    // Set by the create page: the invite opens straight away.
    justCreated?: boolean;
  } | null;
  const justJoined = !!navigationState?.justJoined;

  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartDrawModalOpen, setIsStartDrawModalOpen] = useState(false);
  const [justCreated] = useState(!!navigationState?.justCreated);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(justCreated);
  const [isDrawDoneOpen, setIsDrawDoneOpen] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [exclusions, setExclusions] = useState<Exclusion[]>([]);
  const [myWish, setMyWish] = useState('');
  // null until someone opens or closes the letter editor; right after
  // joining it starts open.
  const [editingLetter, setEditingLetter] = useState<boolean | null>(null);
  const [confirming, setConfirming] = useState<'delete' | 'leave' | null>(null);
  // The person stays set while the dialog fades out, so its text does not
  // change on the way.
  const [removing, setRemoving] = useState<Participant | null>(null);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const askToRemove = (participant: Participant) => {
    setRemoving(participant);
    setIsRemoveOpen(true);
  };

  // A reload should not open the invite again.
  useEffect(() => {
    if (navigationState?.justCreated) {
      navigate(location.pathname, { replace: true, state: { justJoined } });
    }
  }, [navigationState, navigate, location.pathname, justJoined]);

  useEffect(() => {
    const fetchDrawDetails = async () => {
      if (!drawId || !user) return;

      try {
        setLoading(true);
        const drawData = await drawService.getDraw(drawId);

        if (!drawData.participantUuids.includes(user.uid)) {
          console.warn('Access denied: User is not a participant in this draw');
          setAccessDenied(true);
          setError(t('drawPage.errors.accessDenied'));
          return;
        }

        const participants = await drawService.getParticipants(drawId);
        setDraw({ ...drawData, participants });
        setMyWish(await drawService.getLetter(drawId, user.uid));
        // Only the owner may read them, and they matter only before the draw.
        if (
          drawData.ownerUuid === user.uid &&
          drawData.status === 'WAITING_FOR_DRAW'
        ) {
          setExclusions(await drawService.getExclusions(drawId));
        }
      } catch (err) {
        console.error('Error fetching draw details:', err);
        setError(t('drawPage.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchDrawDetails();
  }, [drawId, t, user]);

  const isOwner = !!draw && !!user && draw.ownerUuid === user.uid;
  const isWaiting = draw?.status === 'WAITING_FOR_DRAW';
  const showStartButton =
    isOwner && isWaiting && (draw?.participantUuids.length ?? 0) >= 2;
  const hasLetter = myWish.trim() !== '';
  const allLettersWritten =
    !!draw && draw.participants.every((participant) => participant.hasWish);
  const isEditingLetter = editingLetter ?? (justJoined && isWaiting);
  // The one next step: your own letter first; then, for the owner with
  // every letter in, the draw; otherwise getting everyone in.
  const mainAction: 'write' | 'start' | 'invite' | null = !isWaiting
    ? null
    : !hasLetter
      ? isEditingLetter
        ? null
        : 'write'
      : showStartButton && allLettersWritten
        ? 'start'
        : 'invite';

  // After the draw everyone needs their result, so the draw stays as it is.
  const options: DrawOption[] = !isWaiting
    ? []
    : isOwner
      ? [
          {
            label: t('drawPage.options.edit'),
            icon: <EditOutlined fontSize="small" />,
            onClick: () => setIsEditModalOpen(true),
          },
          {
            label: t('drawPage.password.menu'),
            icon: <KeyOutlined fontSize="small" />,
            onClick: () => setIsPasswordModalOpen(true),
          },
          {
            label: t('drawPage.options.delete'),
            icon: <DeleteOutlined fontSize="small" />,
            onClick: () => setConfirming('delete'),
            danger: true,
          },
        ]
      : [
          {
            label: t('drawPage.options.leave'),
            icon: <Logout fontSize="small" />,
            onClick: () => setConfirming('leave'),
            danger: true,
          },
        ];

  const handleDeleteOrLeave = async () => {
    if (!draw?.id || !user) return;
    try {
      if (confirming === 'delete') {
        await drawService.deleteDraw(draw.id);
        notify(t('drawPage.delete.done'), 'success');
      } else {
        await drawService.leaveDraw(draw.id, user.uid);
        notify(t('drawPage.leave.done'), 'success');
      }
      navigate('/draws', { replace: true });
    } catch (err) {
      console.error('Error deleting or leaving the draw:', err);
      notify(
        confirming === 'delete'
          ? t('drawPage.delete.failed')
          : t('drawPage.leave.failed'),
      );
      setConfirming(null);
    }
  };

  const handleRemove = async () => {
    if (!draw?.id || !removing) return;
    const uid = removing.userUuid;
    try {
      await drawService.removeParticipant(draw.id, uid);
      setDraw({
        ...draw,
        participantUuids: draw.participantUuids.filter((id) => id !== uid),
        participants: draw.participants.filter((p) => p.userUuid !== uid),
      });
      setExclusions(exclusions.filter((pair) => !pair.includes(uid)));
      notify(t('drawPage.remove.done', { name: removing.userName }), 'success');
    } catch (err) {
      console.error('Error removing a participant:', err);
      notify(t('drawPage.remove.failed'));
    }
    setIsRemoveOpen(false);
  };

  // From the start dialog to the exclusions, once the dialog has closed.
  const goToExclusions = () => {
    setTimeout(() => {
      const section = document.getElementById(EXCLUSIONS_SECTION_ID);
      section?.scrollIntoView({ block: 'start' });
      section?.querySelector<HTMLElement>('[role="combobox"]')?.focus();
    }, 300);
  };

  const handleStartDraw = async () => {
    if (!draw || !drawId || !user) return;

    try {
      const updatedDraw = await drawingService.startDraw(drawId, user.uid);
      setDraw({
        ...draw,
        status: updatedDraw.status,
        drawDate: updatedDraw.drawDate,
      });
      setIsStartDrawModalOpen(false);
      // The envelopes are ready; the organizer tells the group.
      setIsDrawDoneOpen(true);
    } catch (err) {
      console.error('Error starting draw:', err);
      notify(t('drawPage.errors.startDrawFailed'));
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress color="inherit" aria-label={t('common.loading')} />
        </Box>
      </MainLayout>
    );
  }

  if (error || !draw || accessDenied) {
    return (
      <MainLayout title={t('drawPage.title')}>
        <Typography variant="h2" sx={{ fontSize: '1.2rem', mb: 2 }}>
          {error || t('drawPage.errors.drawNotFound')}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {/* Someone with a plain link to a draw they are not in yet. */}
          {accessDenied && (
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate(`/join/${drawId}`)}
            >
              {t('drawPage.goToJoin')}
            </Button>
          )}
          <Button
            variant={accessDenied ? 'outlined' : 'contained'}
            color={accessDenied ? 'inherit' : 'primary'}
            startIcon={<ArrowBack />}
            onClick={() => navigate('/draws')}
            sx={accessDenied ? { color: tokens.snow } : undefined}
          >
            {t('common.backToDraws')}
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, sm: 5 } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <BackToDraws />
          <DrawHeader draw={draw} />
          {isWaiting && <DrawStatus draw={draw} isOwner={isOwner} />}

          {isWaiting && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                '& > *': { flex: { xs: '1 1 100%', sm: '0 0 auto' } },
              }}
            >
              {/* Wax marks the one next step, and it comes first. */}
              {mainAction === 'write' && (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setEditingLetter(true)}
                >
                  {t('drawPage.wishSection.writeButton')}
                </Button>
              )}

              {mainAction === 'start' && (
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => setIsStartDrawModalOpen(true)}
                >
                  {t('drawPage.startDrawButton')}
                </Button>
              )}

              <Button
                variant={mainAction === 'invite' ? 'contained' : 'outlined'}
                color={mainAction === 'invite' ? 'primary' : 'inherit'}
                startIcon={<PersonAdd />}
                onClick={() => setIsInviteModalOpen(true)}
                sx={mainAction === 'invite' ? undefined : { color: tokens.snow }}
              >
                {t('drawPage.inviteButton')}
              </Button>

              {showStartButton && mainAction !== 'start' && (
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<PlayArrow />}
                  onClick={() => setIsStartDrawModalOpen(true)}
                  sx={{ color: tokens.snow }}
                >
                  {t('drawPage.startDrawButton')}
                </Button>
              )}

              <DrawOptionsMenu options={options} />
            </Box>
          )}

          {/* After the draw the organizer can tell the group again. */}
          {isOwner && !isWaiting && (
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Campaign />}
              onClick={() => setIsDrawDoneOpen(true)}
              sx={{
                color: tokens.snow,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              {t('drawPage.drawDone.notifyButton')}
            </Button>
          )}
        </Box>

        {draw.status === 'DRAWED' && <WinnerSection draw={draw} />}

        {/* Still editable after the draw, so the Santa sees the latest wish. */}
        <UserWishSection
          draw={draw}
          savedWish={myWish}
          onWishSaved={(wish) => {
            setMyWish(wish);
            setDraw({
              ...draw,
              participants: draw.participants.map((p) =>
                p.userUuid === user?.uid ? { ...p, hasWish: wish !== '' } : p,
              ),
            });
          }}
          isEditing={isEditingLetter}
          onEditingChange={setEditingLetter}
          writeButtonInRow={isWaiting}
        />

        <ParticipantsSection
          draw={draw}
          onRemove={isOwner && isWaiting ? askToRemove : undefined}
        />

        {isOwner && isWaiting && draw.participantUuids.length >= 2 && (
          <ExclusionsSection
            draw={draw}
            exclusions={exclusions}
            onChange={setExclusions}
          />
        )}
      </Box>

      {showStartButton && (
        <StartDrawModal
          open={isStartDrawModalOpen}
          onClose={() => setIsStartDrawModalOpen(false)}
          onConfirm={handleStartDraw}
          draw={draw}
          exclusions={currentExclusions(draw, exclusions)}
          onEditExclusions={goToExclusions}
          onForgotPassword={() => setIsPasswordModalOpen(true)}
          withoutWish={draw.participants
            .filter((p) => !p.hasWish)
            .map((p) => p.userName)}
        />
      )}

      {isOwner && isWaiting && (
        <EditDrawModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          draw={draw}
          onSaved={(details) => setDraw({ ...draw, ...details })}
        />
      )}

      {isOwner && isWaiting && (
        <SetPasswordModal
          open={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          drawId={draw.id ?? ''}
        />
      )}

      <ConfirmDialog
        open={!!confirming}
        title={
          confirming === 'delete'
            ? t('drawPage.delete.title')
            : t('drawPage.leave.title')
        }
        text={
          confirming === 'delete'
            ? t('drawPage.delete.text', { name: draw.drawName })
            : t('drawPage.leave.text', { name: draw.drawName })
        }
        confirmLabel={
          confirming === 'delete'
            ? t('drawPage.delete.confirm')
            : t('drawPage.leave.confirm')
        }
        onClose={() => setConfirming(null)}
        onConfirm={handleDeleteOrLeave}
      />

      <ConfirmDialog
        open={isRemoveOpen}
        title={t('drawPage.remove.title')}
        text={t('drawPage.remove.text', {
          name: removing?.userName ?? '',
          draw: draw.drawName,
        })}
        confirmLabel={t('drawPage.remove.confirm')}
        onClose={() => setIsRemoveOpen(false)}
        onConfirm={handleRemove}
      />

      {isOwner && (
        <DrawDoneModal
          open={isDrawDoneOpen && !isWaiting}
          onClose={() => setIsDrawDoneOpen(false)}
          draw={draw}
        />
      )}

      <InviteDrawModal
        open={isInviteModalOpen && isWaiting}
        onClose={() => setIsInviteModalOpen(false)}
        draw={draw}
        isOwner={isOwner}
        justCreated={justCreated}
      />
    </MainLayout>
  );
};

export default DrawPage;
