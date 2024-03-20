"use server"

import Stripe from 'stripe';
import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { connectDB } from "../db"
import { handleError } from "../utils";
import { redirect } from 'next/navigation';
import Order from '../db/models/Order';

export const checkoutOrder = async (order: CheckoutOrderParams) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const price = order.isFree ? 0 : Number(order.price) * 100;
    try {
        connectDB();

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        unit_amount: price,
                        product_data: {
                            name: order.eventTitle,
                        }
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                eventId: order.eventId,
                buyerId: order.buyerId
            },
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
        });

        redirect(session.url!);

    } catch (error) {
        throw error;
    }
}

export const createOrder = async (order: CreateOrderParams) => {
    try {
        await connectDB();
        const newOrder = await Order.create({
            ...order,
            event: order.eventId,
            buyer: order.buyerId
        });
        return JSON.parse(JSON.stringify(newOrder));
    } catch (error) {
        handleError(error);
    }
}