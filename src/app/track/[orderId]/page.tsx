import React from 'react';
import { Metadata } from 'next';
import { LiveOrderTracker } from '@/components/order/LiveOrderTracker';

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Track Order #${orderId} | De Pizzano Karachi`,
    description: `Live order tracking and delivery status for order #${orderId} from De Pizzano Soldier Bazar Karachi.`,
  };
}

export default async function OrderTrackDetailPage({ params }: PageProps) {
  const { orderId } = await params;

  return <LiveOrderTracker orderId={orderId} />;
}

