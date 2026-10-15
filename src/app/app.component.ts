import { Component, HostListener, OnInit } from '@angular/core';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: 'engineering' | 'design' | 'product' | 'qa' | 'leadership' | 'operations';
  nickname?: string;
  avatarUrl?: string; // Optional image URL (leave empty to use cool initials avatar)
  avatarInitials: string;
  gradient: string; // CSS gradient for avatar and card glow
  badge: string; // Fun badge/tag
  personalMessage: string; // Heartfelt thank you note
  bestMemory: string; // Special memory/moment
  specialSkill: string; // Their superpower
  partingWish: string; // Warm wish for them
  tags: string[];
  likesCount: number;
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
  // 📝 EDIT YOUR TEAM MEMBERS DATA HERE:
  // You can easily modify, add or remove members below with your real data!
  // =====================================================================
  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Aditya Sharma',
      role: 'Tech Lead & Architect',
      department: 'leadership',
      nickname: 'The Code Sensei 🧘‍♂️',
      avatarInitials: 'AS',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      badge: 'Architecture Guru 🏛️',
      personalMessage: 'Bhai, your guidance and patience in explaining complex system architectures helped me grow tremendously as a developer. You never hesitated to jump on a debug call even at 11 PM before critical releases. Thank you for always believing in my potential and having my back!',
      bestMemory: 'The time our production deployment failed at 2 AM, and you calmly solved the CORS and DNS mess in 5 minutes with a cup of green tea in hand.',
      specialSkill: 'Can spot a memory leak in code reviews from 10 miles away.',
      partingWish: 'Keep inspiring developers around you! Wishing you massive milestones and simpler sprints ahead.',
      tags: ['#TechLead', '#Mentor', '#SystemDesign', '#ZeroDowntime'],
      likesCount: 42
    },
    {
      id: 2,
      name: 'Priya Nair',
      role: 'Lead UI/UX Designer',
      department: 'design',
      nickname: 'Pixel Perfect Queen ✨',
      avatarInitials: 'PN',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      badge: 'Figma Wizard 🎨',
      personalMessage: 'Thank you for making our applications look like a dream! Working with you made frontend development 100x more fun because every screen you designed had so much soul and attention to detail. Thanks for not killing me when I said "ye animation thoda tough hai"!',
      bestMemory: 'Our endless debates over 8px vs 12px border-radius and why comic sans should be permanently deleted from the universe.',
      specialSkill: 'Can redesign an entire complex dashboard in 45 minutes.',
      partingWish: 'May all your Figma frames stay organized and your client feedback always say "Approved in V1"!',
      tags: ['#DesignGenius', '#Glassmorphism', '#MicroInteractions', '#FigmaGod'],
      likesCount: 56
    },
    {
      id: 3,
      name: 'Rohan Verma',
      role: 'Senior Backend Developer',
      department: 'engineering',
      nickname: 'Database Whisperer ⚡',
      avatarInitials: 'RV',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      badge: 'Query Optimizer 🚀',
      personalMessage: 'Brother, you are truly the backbone of our backend services. Your SQL queries run faster than light and your calm demeanor in high-pressure situations has always been infectious. I will deeply miss our daily 4 PM chai discussions on tech, life, and startups!',
      bestMemory: 'Optimizing that monster reporting query from 42 seconds down to 180 milliseconds and celebrating with cutting chai and samosas.',
      specialSkill: 'Writes microservices in his sleep; zero unhandled promise rejections.',
      partingWish: 'Hope you conquer all your engineering goals, hit the next senior level, and buy that dream motorcycle soon!',
      tags: ['#BackendBeast', '#PostgreSQL', '#ChaiPartner', '#CleanCode'],
      likesCount: 38
    },
    {
      id: 4,
      name: 'Sneha Kulkarni',
      role: 'Product Manager',
      department: 'product',
      nickname: 'Chaos Coordinator 🧭',
      avatarInitials: 'SK',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      badge: 'Roadmap Queen 👑',
      personalMessage: 'Thank you for protecting our engineering sprints from random scope creeps and always translating crazy stakeholder requirements into clear, sensible user stories. Your positive energy in every standup set the tone for the entire day!',
      bestMemory: 'When you brought homemade brownies to the office after our successful Q3 release launch.',
      specialSkill: 'Translating corporate jargon into actual human language with effortless grace.',
      partingWish: 'May your backlogs always be groomed, your stakeholders always be reasonable, and your coffee never get cold!',
      tags: ['#ProductVisionary', '#SprintSavior', '#BestStandups', '#HighEnergy'],
      likesCount: 61
    },
    {
      id: 5,
      name: 'Vikram Malhotra',
      role: 'Lead QA Engineer',
      department: 'qa',
      nickname: 'The Bug Terminator 🎯',
      avatarInitials: 'VM',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      badge: 'Zero Defect Champion 🛡️',
      personalMessage: 'Bhai, you found bugs in edge cases that even the compiler didn’t know existed! Thank you for catching our silly mistakes before customers ever saw them. Your detailed Jira tickets with screen recordings were a developer’s dream.',
      bestMemory: 'That time you crashed our staging app by pasting an entire Hindi poem with emojis into a numeric phone number input!',
      specialSkill: 'Breaks any system within 3 minutes of opening devtools.',
      partingWish: 'Keep safeguarding software quality like a superhero! May your test automation scripts always pass on the first run.',
      tags: ['#BugHunter', '#QualityFirst', '#PlaywrightPro', '#NightmareForBugs'],
      likesCount: 34
    },
    {
      id: 6,
      name: 'Ananya Roy',
      role: 'Frontend Engineer',
      department: 'engineering',
      nickname: 'CSS Alchemist 🪄',
      avatarInitials: 'AR',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      badge: 'Component Crafter 💎',
      personalMessage: 'Thank you for being such an incredible pair-programming buddy! We spent so many hours debugging weird responsive layout bugs and building slick reusable components. Your enthusiasm to learn modern frameworks inspired me everyday.',
      bestMemory: 'Celebrating our first open-source PR merge together with high fives and office cafeteria pastries.',
      specialSkill: 'Centering divs in 6 different ways and writing ultra-smooth animations.',
      partingWish: 'You have an extraordinary career ahead of you. Keep building, keep shining, and never stop experimenting!',
      tags: ['#FrontendDev', '#AngularLover', '#ModernUI', '#FutureTechLead'],
      likesCount: 49
    },
    {
      id: 7,
      name: 'Karan Mehta',
      role: 'DevOps & Cloud Engineer',
      department: 'operations',
      nickname: 'Pipeline Magician ☁️',
      avatarInitials: 'KM',
      gradient: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
      badge: 'Docker & K8s Ninja 🐳',
      personalMessage: 'Without you, our code would just be sitting on localhost! Thank you for setting up rock-solid CI/CD pipelines and making deployments a breeze with just one git tag. You saved us countless hours of manual deployment headache.',
      bestMemory: 'The day you automated our 45-minute manual release process into a 90-second GitHub Actions pipeline.',
      specialSkill: 'Can configure Kubernetes clusters blindfolded without a single syntax error.',
      partingWish: 'May your servers always have 99.999% uptime, your AWS bills stay low, and your container logs be forever green!',
      tags: ['#CloudMaster', '#Kubernetes', '#CI_CD', '#AutomationHero'],
      likesCount: 45
    },
    {
      id: 8,
      name: 'Ritu Sen',
      role: 'Scrum Master & Culture Lead',
      department: 'leadership',
      nickname: 'Chief Smile Officer 😊',
      avatarInitials: 'RS',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
      badge: 'Team Morale Booster 🌟',
      personalMessage: 'Thank you for making our workplace feel like a second home. From organizing our epic team outings and festive celebrations to checking in on us when work got overwhelming, your empathy made all the difference.',
      bestMemory: 'Our crazy team building quiz and dumb-charades session where everyone was laughing until their stomachs hurt.',
      specialSkill: 'Resolving team blockers and bringing positive energy into any room instantly.',
      partingWish: 'Never lose your infectious warmth and kindness. Wishing you abundant joy, peace, and great adventures ahead!',
      tags: ['#HeartOfTheTeam', '#ScrumMaster', '#WorkplaceCulture', '#Empathy'],
      likesCount: 52
    }
  ];

  // Quick statistics
  get totalMembers(): number {
    return this.teamMembers.length;
  }

  get totalAppreciations(): number {
    return this.teamMembers.reduce((sum, m) => sum + m.likesCount, 0);
  }

  ngOnInit(): void {
    // Canvas stars & confetti are initialized after view setup
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
        member.badge.toLowerCase().includes(q) ||
        member.tags.some(t => t.toLowerCase().includes(q));

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
    member.likesCount++;
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
