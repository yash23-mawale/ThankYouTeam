import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Strict Department Union Type - Leads, Developers, and QA only
export type Department = 'leadership' | 'engineering' | 'qa';

// 🎨 Palette of beautiful card gradients (Automatically assigned to cards)
export const CARD_GRADIENTS: string[] = [
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo -> Purple
  'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', // Pink -> Rose
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', // Cyan -> Blue
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Amber -> Orange
  'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald -> Green
  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', // Violet -> Fuchsia
  'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)', // Sky -> Indigo
  'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)', // Rose -> Sunset
  'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)', // Purple -> Cyan
  'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)'  // Teal -> Blue
];

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: Department; // Strict: 'leadership' | 'engineering' | 'qa'
  nickname?: string;
  avatarUrl?: string; // Optional image URL (agar image nahi hai to avatarInitials use hoga)
  avatarInitials: string;
  gradient?: string; // Optional: agar nahi denge to automatic CARD_GRADIENTS me se lag jayega
  badge?: string; // Fun badge/tag
  personalMessage: string; // Heartfelt thank you note
  bestMemory?: string; // Special memory/moment
  specialSkill?: string; // Superpower
  partingWish?: string; // Warm wish
  tags?: string[];
  likesCount?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Title & Metadata
  title = 'Before I Sign Off...';

  // Search & Filter State
  searchQuery: string = '';
  activeFilter: string = 'all';

  // Modal State
  selectedMember: TeamMember | null = null;
  isModalOpen: boolean = false;
  isLikedInModal: boolean = false;

  // Sound effects toggle
  soundEnabled: boolean = true;
  private audioCtx: AudioContext | null = null;

  // =====================================================================
  // 📝 DATA IS LOADED DYNAMICALLY FROM: src/assets/team-members.json
  // You can edit src/assets/team-members.json anytime without code changes!
  // =====================================================================
  teamMembers: TeamMember[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  // Quick statistics
  get totalMembers(): number {
    return this.teamMembers.length;
  }

  get totalAppreciations(): number {
    return this.teamMembers.reduce((sum, m) => sum + (m.likesCount || 0), 0);
  }

  ngOnInit(): void {
    this.loadTeamMembers();
  }

  // Fetch team members from assets/team-members.json
  loadTeamMembers(): void {
    this.http.get<TeamMember[]>('assets/team-members.json').subscribe({
      next: (data) => {
        this.teamMembers = data || [];
        this.assignGradients();
        this.isLoading = false;
      },
      error: (err) => {
        console.warn('HttpClient assets fetch failed, trying browser fetch fallback...', err);
        fetch('assets/team-members.json')
          .then(res => res.json())
          .then((data: TeamMember[]) => {
            this.teamMembers = data || [];
            this.assignGradients();
            this.isLoading = false;
          })
          .catch(fetchErr => {
            console.error('Could not load team members from assets/team-members.json:', fetchErr);
            this.isLoading = false;
          });
      }
    });
  }

  // Assign beautiful gradients cyclically/randomly based on member id or index
  private assignGradients(): void {
    this.teamMembers.forEach((member, index) => {
      if (!member.gradient) {
        // Deterministic by ID / index so colors stay consistent across filters & search
        const colorIndex = (member.id !== undefined ? Math.abs(member.id - 1) : index) % CARD_GRADIENTS.length;
        member.gradient = CARD_GRADIENTS[colorIndex];
      }
    });
  }

  // Filtered members by search query and category
  get filteredMembers(): TeamMember[] {
    return this.teamMembers.filter(member => {
      const matchesCategory = this.activeFilter === 'all' || member.department === this.activeFilter;
      const q = this.searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        (member.nickname && member.nickname.toLowerCase().includes(q)) ||
        (member.badge && member.badge.toLowerCase().includes(q)) ||
        (member.tags && member.tags.some(t => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }

  // Filter selection
  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.playChime(440, 'triangle');
  }

  // Open modal for a member
  openMemberModal(member: TeamMember): void {
    this.selectedMember = member;
    this.isModalOpen = true;
    this.isLikedInModal = false;
    document.body.style.overflow = 'hidden';

    // Play pleasant opening chime
    this.playCelebrationChime();

    // Trigger confetti burst
    setTimeout(() => {
      this.triggerConfetti();
    }, 150);
  }

  // Close modal
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedMember = null;
    document.body.style.overflow = 'auto';
    this.playChime(320, 'sine');
  }

  // Navigate to Next Member inside Modal
  nextMember(): void {
    if (!this.selectedMember) return;
    const currentList = this.filteredMembers;
    const currentIndex = currentList.findIndex(m => m.id === this.selectedMember?.id);
    const nextIndex = (currentIndex + 1) % currentList.length;
    this.selectedMember = currentList[nextIndex];
    this.isLikedInModal = false;
    this.playChime(520, 'triangle');
    this.triggerConfetti(25);
  }

  // Navigate to Previous Member inside Modal
  prevMember(): void {
    if (!this.selectedMember) return;
    const currentList = this.filteredMembers;
    const currentIndex = currentList.findIndex(m => m.id === this.selectedMember?.id);
    const prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    this.selectedMember = currentList[prevIndex];
    this.isLikedInModal = false;
    this.playChime(460, 'triangle');
    this.triggerConfetti(25);
  }

  // Like / Send Love
  likeMember(member: TeamMember, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    member.likesCount = (member.likesCount || 0) + 1;
    this.isLikedInModal = true;
    this.playChime(650, 'sine');

    // Spawn floating heart particle
    if (event) {
      this.spawnFloatingHeart(event.clientX, event.clientY);
    }
  }

  // Keyboard shortcut listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.isModalOpen) return;

    if (event.key === 'Escape') {
      this.closeModal();
    } else if (event.key === 'ArrowRight') {
      this.nextMember();
    } else if (event.key === 'ArrowLeft') {
      this.prevMember();
    }
  }

  // Toggle Sound
  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
  }

  // Lightweight Web Audio API Chime (Zero external dependencies)
  private playChime(freq: number = 440, type: OscillatorType = 'sine'): void {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch {
      // Audio not permitted or supported; silently ignore
    }
  }

  private playCelebrationChime(): void {
    if (!this.soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playChime(freq, 'triangle'), idx * 70);
    });
  }

  // Floating Heart Particle on Click
  private spawnFloatingHeart(x: number, y: number): void {
    const heart = document.createElement('div');
    heart.innerText = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.fontSize = '24px';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.transition = 'all 0.9s cubic-bezier(0.1, 0.8, 0.3, 1)';
    heart.style.opacity = '1';

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translate(-50%, -100px) scale(1.6) rotate(${Math.random() * 40 - 20}deg)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => {
      heart.remove();
    }, 950);
  }

  // Pure Canvas Confetti Explosion
  private triggerConfetti(particleCount: number = 60): void {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9998';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.remove();
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#a78bfa', '#38bdf8', '#f472b6', '#34d399', '#fbbf24', '#f87171', '#ffffff'];
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: canvas.width * 0.5,
      y: canvas.height * 0.45,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 16,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 12,
      opacity: 1,
      gravity: 0.35
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.vRotation;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
        canvas.remove();
      }
    };

    animationFrameId = requestAnimationFrame(render);
  }
}
