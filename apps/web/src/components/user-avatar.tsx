'use client';

import Avvvatars from 'avvvatars-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@formbase/ui/primitives/avatar';

interface UserAvatarProps {
  src?: string | null;
  seed: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 24,
  default: 32,
  lg: 40,
} as const;

export function UserAvatar({
  src,
  seed,
  size = 'default',
  className,
}: UserAvatarProps) {
  const hasImage = src && src.trim().length > 0;

  return (
    <Avatar size={size} className={className}>
      {hasImage ? (
        <AvatarImage src={src} alt="Avatar" />
      ) : null}
      <AvatarFallback>
        <Avvvatars value={seed} size={sizeMap[size]} />
      </AvatarFallback>
    </Avatar>
  );
}
