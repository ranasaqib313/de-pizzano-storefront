'use client';

import React from 'react';
import { LeftNavDock } from './LeftNavDock';

interface RightNavRailProps {
  onOpenMenu?: () => void;
}

/**
 * Re-export LeftNavDock as RightNavRail for backward compatibility
 * while fulfilling the architectural requirement to transition to the
 * Aurora Floating Glass Dock on the left.
 */
export function RightNavRail({ onOpenMenu }: RightNavRailProps) {
  return <LeftNavDock />;
}

export { LeftNavDock };
