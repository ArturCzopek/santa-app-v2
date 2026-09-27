import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Letter } from '../../models/Draw';
import { tokens } from '../../styles/theme';
import { splitWishIntoLines, splitWishLine } from './letterText';

interface LetterViewProps {
  letter: Letter;
}

const LetterView: React.FC<LetterViewProps> = ({ letter }) => {
  const { t } = useTranslation();
  const lines = splitWishIntoLines(letter.wish);
  const hasSizes = letter.sizes.trim() !== '';
  const hasNotWanted = letter.notWanted.trim() !== '';

  if (lines.length === 0 && !hasSizes && !hasNotWanted) {
    return (
      <Typography color="text.secondary">
        {t('drawPage.winnerSection.noWishProvided')}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 1.5, color: tokens.ink }}>
      {lines.length > 0 && (
        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
          {lines.map((line, lineIndex) => (
            <Box component="li" key={`${lineIndex}-${line}`} sx={{ mb: 0.5 }}>
              <Typography
                component="span"
                sx={{ fontSize: '1.125rem', lineHeight: 1.6 }}
              >
                {splitWishLine(line).map((part, partIndex) =>
                  part.type === 'link' ? (
                    <a
                      key={partIndex}
                      href={part.value}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      style={{ color: 'inherit' }}
                    >
                      {part.value}
                    </a>
                  ) : (
                    <React.Fragment key={partIndex}>
                      {part.value}
                    </React.Fragment>
                  ),
                )}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {hasSizes && (
        <Box>
          <Typography sx={{ fontWeight: 700 }}>
            {t('drawPage.wishSection.sizesHeading')}
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {letter.sizes}
          </Typography>
        </Box>
      )}

      {hasNotWanted && (
        <Box>
          <Typography sx={{ fontWeight: 700 }}>
            {t('drawPage.wishSection.notWantedHeading')}
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {letter.notWanted}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LetterView;
