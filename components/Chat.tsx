"use client"

import { useChat } from "ai/react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"

export const Chat = () => {
    const { messages, input, handleInputChange, handleSubmit } = useChat();

    return (
        <Card className="w-[440px]">
            <CardTitle>
                Chat Fotolux
            </CardTitle>
            <CardDescription>
                Automação com IA para FAQ da Fotolux
            </CardDescription>
            <CardContent>
                <ScrollArea className="h-[400px] w-full pr-4">
                    {messages.map((message) => {
                        return (
                            <div key={message.id} className="flex gap-3 text-slate-600 text-sm mb-4">
                                {message.role === 'user' && (
                                    <Avatar>
                                        <AvatarFallback>US</AvatarFallback>
                                    </Avatar>
                                )}
                                {message.role === 'assistant' && (
                                    <Avatar>
                                        <AvatarFallback>IA</AvatarFallback>
                                    </Avatar>
                                )}
                                {message.role === 'assistant' && (
                                    <p className="leading-relaxed">
                                    <span className="block font-bold text-slate-700">
                                        Fotolux
                                    </span>
                                    {message.content}
                                </p>
                                )}
                               {message.role === 'user' && (
                                    <p className="leading-relaxed">
                                    <span className="block font-bold text-slate-700">
                                        Cliente
                                    </span>
                                    {message.content}
                                </p>
                                )}
                            </div>
                        )
                    })
                    }
                </ScrollArea>

            </CardContent>
            <CardFooter>
                <form className="w-full gap-2 flex" onSubmit={handleSubmit}>
                    <Input placeholder="Qual sua dúvida?" value={input} onChange={handleInputChange} />
                    <Button type="submit">Enviar</Button>
                </form>
            </CardFooter>
        </Card>
    )
}