import { NextRequest, NextResponse } from "next/server";


const messageSuggestion = [
    { id: 1, text: "What’s a hobby you’ve recently started?" },
    { id: 2, text: "If you could have dinner with any historical figure, who would it be?" },
    { id: 3, text: "What’s a simple thing that makes you happy?" },
    { id: 4, text: "What’s a place you want to travel to and why?" },
    { id: 5, text: "If you could master any skill instantly, what would it be?" },
    { id: 6, text: "What’s the last book or movie that inspired you?" },
    { id: 7, text: "What’s your favorite way to spend a weekend?" },
    { id: 8, text: "If you had a time machine, what time would you visit?" },
    { id: 9, text: "What’s a fun fact about yourself?" },
    { id: 10, text: "What’s something you’ve always wanted to learn?" },
    { id: 11, text: "What’s your go-to comfort food?" },
    { id: 12, text: "If you could live in any fictional universe, which one would it be?" },
    { id: 13, text: "What’s a song that always lifts your mood?" },
    { id: 14, text: "What’s your favorite childhood memory?" },
    { id: 15, text: "If you could switch jobs for a day, what would you choose?" },
    { id: 16, text: "What’s one thing on your bucket list?" },
    { id: 17, text: "What’s your favorite way to relax after a long day?" },
    { id: 18, text: "If you could instantly learn a new language, what would it be?" },
    { id: 19, text: "What’s your favorite season and why?" },
    { id: 20, text: "What’s a movie you can watch over and over?" },
    { id: 21, text: "If you could have any animal as a pet, what would it be?" },
    { id: 22, text: "What’s your favorite holiday tradition?" },
    { id: 23, text: "What’s one app you can’t live without?" },
    { id: 24, text: "What’s a talent you wish you had?" },
    { id: 25, text: "If you could design your dream house, what would it have?" },
    { id: 26, text: "What’s your favorite way to stay active?" },
    { id: 27, text: "What’s a piece of advice you’ve never forgotten?" },
    { id: 28, text: "What’s your favorite dessert?" },
    { id: 29, text: "If you could time travel, would you visit the past or future?" },
    { id: 30, text: "What’s your favorite quote?" },
    { id: 31, text: "What’s a small act of kindness that made your day?" },
    { id: 32, text: "If you could invent something, what would it be?" },
    { id: 33, text: "What’s your dream vacation destination?" },
    { id: 34, text: "What’s your favorite board or card game?" },
    { id: 35, text: "If you could have any superpower, what would it be?" },
    { id: 36, text: "What’s your favorite way to spend a rainy day?" },
    { id: 37, text: "What’s your favorite outdoor activity?" },
    { id: 38, text: "What’s one goal you’re working towards?" },
    { id: 39, text: "If you could meet any living person, who would it be?" },
    { id: 40, text: "What’s your favorite type of music?" },
    { id: 41, text: "What’s your favorite way to celebrate your birthday?" },
    { id: 42, text: "What’s a language you wish you could speak fluently?" },
    { id: 43, text: "If you could redo one day in your life, which would it be?" },
    { id: 44, text: "What’s your favorite ice cream flavor?" },
    { id: 45, text: "What’s a hobby you’d like to try?" },
    { id: 46, text: "What’s your favorite thing to cook or bake?" },
    { id: 47, text: "What’s your favorite animal?" },
    { id: 48, text: "What’s one thing that always makes you laugh?" },
    { id: 49, text: "If you could live anywhere in the world, where would it be?" },
    { id: 50, text: "What’s your favorite childhood game?" }
]

export async function GET(request: NextRequest){
    try{
        const shuffledMessage = messageSuggestion.sort(() => 0.5 - Math.random()).slice(0, 3);

        return NextResponse.json({
            success: true,
            status: 200,
            shuffledMessage
        })
    }
    catch(error: unknown){
        console.log("Something went wrong while fetching the messages suggestion");
        if(error instanceof Error){
            console.log("An error occured, ", error.message);
        }
        else{
            console.log("Unknown error, ", error);
        }
                
        return NextResponse.json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}