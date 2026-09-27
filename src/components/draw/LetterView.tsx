import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Letter } from '../../models/Draw';
import { tokens } from '../../styles/theme';
import { splitWishIntoLines, splitWishLine } from './letterText';

interface LetterViewProps {
  letter: Letter;
}

const linkedText = (line: string) =>
  splitWishLine(line).map((part, partIndex) =>
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
      <React.Fragment key={partIndex}>{part.value}</React.Fragment>
    ),
  );

const LetterView: React.FC<LetterViewProps> = ({ letter }) => {
  const { t } = useTranslation();
  const items = splitWishIntoLines(letter.wish);
  const hasComment = letter.comment.trim() !== '';

  if (items.length === 0 && !hasComment) {
    return (
      <Typography color="text.secondary">
        {t('drawPage.winnerSection.noWishProvided')}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 1.5, color: tokens.ink }}>
      {items.length > 0 && (
        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
          {items.map((item, itemIndex) => (
            <Box component="li" key={`${itemIndex}-${item}`} sx={{ mb: 0.5 }}>
              <Typography
                component="span"
                sx={{ fontSize: '1.125rem', lineHeight: 1.6 }}
              >
                {linkedText(item)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {hasComment && (
        <Box>
          <Typography sx={{ fontWeight: 700 }}>
            {t('drawPage.wishSection.commentHeading')}
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {letter.comment.split(/\r?\n/).map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {lineIndex > 0 && '\n'}
                {linkedText(line)}
              </React.Fragment>
            ))}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LetterView;
