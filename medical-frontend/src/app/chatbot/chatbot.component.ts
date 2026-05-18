import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { ChatbotService } from '../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})

export class ChatbotComponent implements AfterViewChecked {

  constructor(private chatbotService: ChatbotService) {}

  @ViewChild('chatContainer')
  private chatContainer!: ElementRef;

  isChatOpen = false;

  isTyping = false;

  userMessage = '';

  messages: any[] = [

    {
      sender: 'bot',
      text: 'Hello! I am MediCare AI Assistant.'
    }

  ];

  toggleChatbot() {

    this.isChatOpen = !this.isChatOpen;

  }

  ngAfterViewChecked(): void {

    this.scrollToBottom();

  }

  scrollToBottom(): void {

    try {

      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;

    } catch(err) {}

  }

  sendMessage() {

    if (!this.userMessage.trim()) return;

    // Add User Message
    this.messages.push({

      sender: 'user',
      text: this.userMessage

    });

    const question = this.userMessage;

    this.userMessage = '';

    // Show Typing
    this.isTyping = true;

    // API Call
    this.chatbotService.sendMessage(question)
    .subscribe({

      next: (res: any) => {

        this.isTyping = false;

        this.messages.push({

          sender: 'bot',
          text: res.answer

        });

      },

      error: () => {

        this.isTyping = false;

        this.messages.push({

          sender: 'bot',
          text: 'Server Error. Please try again.'

        });

      }

    });

  }

}