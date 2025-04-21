import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago"
import mpClient from "@/app/lib/mercado-pago";

export async function POST(req: NextRequest){
    const { testeId, userEmail } = await req.json();

    try {
        const preference = new Preference(mpClient)

        const createdPreference = await preference.create({
            body:{
                external_reference: testeId,
                metadata:{
                    testeId,
                    userEmail
                },
                ...(userEmail && { payer_email: userEmail }),
                items: [
                    {
                        id: testeId,
                        title: "Teste",
                        description: "Teste de integração com Mercado Pago",
                        quantity: 1,
                        currency_id: "BRL",
                        unit_price: 10.0,
                        category_id: "services"
                    },
                ],
                payment_methods: {
                    installments: 12,
                },
                auto_return: "approved",
                back_urls: {
                    success: `${req.headers.get("origin")}/api/mercado-pago/pending`,
                    failure: `${req.headers.get("origin")}/api/mercado-pago/pending`,
                    pending: `${req.headers.get("origin")}/api/mercado-pago/pending`,
                },
            }
        });

        if(!createdPreference) {
            return NextResponse.json({error:"Failed to create preference"}, { status: 500 });
        }
        return NextResponse.json({ 
            preferenceId: createdPreference.id,
            initPoint: createdPreference.init_point,
        }, { status: 200 });

    }catch (error) {
        console.error("Error creating Mercado Pago preference:", error);
        return NextResponse.json({error:"Internal Server Error"}, { status: 500 });
    }
}