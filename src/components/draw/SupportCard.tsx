import { Button, Typography } from '@mui/material';
import { LocalCafe } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PaperCard from '../common/PaperCard';
import { COFFEE_URL } from '../../monetization/coffee';
import { tokens } from '../../styles/theme';

// Optional thanks + coffee link under the draw result (D39).
const SupportCard = () => {
  const { t } = useTranslation();

  return (
    <PaperCard sx={{ gap: 1.5 }}>
      <Typography variant="h6" component="h2">
        {t('drawPage.supportCard.heading')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('drawPage.supportCard.text')}
      </Typography>
      <Button
        component="a"
        href={COFFEE_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
        startIcon={<LocalCafe />}
        sx={{
          alignSelf: { xs: 'stretch', sm: 'flex-start' },
          backgroundColor: tokens.stampGold,
          color: tokens.ink,
          '&:hover': {
            backgroundColor: tokens.amber,
            color: tokens.paper,
          },
        }}
      >
        {t('drawPage.supportCard.button')}
      </Button>
    </PaperCard>
  );
};

export default SupportCard;
