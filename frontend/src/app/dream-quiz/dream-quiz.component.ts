import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dream-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dream-quiz.component.html',
  styleUrls: ['./dream-quiz.component.css']
})
export class DreamQuizComponent {
  // Valorile din formular
  sleepHours: number | null = null;
  nightAwakenings: number | null = null;
  timeToFall: number | null = null;
  stressLevel: number = 1;
  anxietyLevel: number = 1;
  moodLevel: number = 1;
  symbols: string[] = [];

  // Raportul final (text)
  report: string = '';

  // Șabloane pentru calitatea somnului
  private sleepTemplates: Record<string, string> = {
    good: `You reported sleeping {{hours}} hours per night, waking up {{awakenings}} time(s), and taking {{timeToFall}} minutes to fall asleep. This indicates a generally good quality of sleep (7–8 hours recommended).
Suggestions:
- Maintain consistent bed and wake times, even on weekends.
- Keep your bedroom quiet and dark; avoid screens after 9 PM.
`,
    moderate: `You reported sleeping {{hours}} hours per night, waking up {{awakenings}} time(s), and taking {{timeToFall}} minutes to fall asleep. This suggests moderate sleep quality—slightly below the optimal range.
Suggestions:
- Try going to bed 30 minutes earlier to reach at least 7 hours of sleep.
- Avoid heavy meals 2–3 hours before bedtime; opt for a light snack.
`,
    poor: `You reported sleeping {{hours}} hours per night, waking up {{awakenings}} time(s), and taking {{timeToFall}} minutes to fall asleep. This indicates poor sleep quality (below 6 hours and frequent awakenings).
Suggestions:
- Set a fixed bedtime at least 30–45 minutes earlier than usual.
- Avoid screens one hour before bed; if you wake up, avoid checking the clock. If you can’t fall back asleep in 15–20 minutes, keep lights dim and try again.
`
  };

  // Șabloane pentru starea emoțională
  private emotionTemplates: Record<string, string> = {
    low: `Emotional Check:
- Stress: {{stress}}/5
- Dream Anxiety: {{anxiety}}/5
- Mood: {{mood}}/5
You’re in a balanced emotional state with low stress and anxiety, and a positive mood.
Suggestions:
- Continue monitoring, and if anything changes, retake the quiz to track your progress.
`,
    moderate: `Emotional Check:
- Stress: {{stress}}/5
- Dream Anxiety: {{anxiety}}/5
- Mood: {{mood}}/5
Your emotional levels are moderate—some fluctuations may exist.
Suggestions:
- Spend 5 minutes each day practicing a brief breathing exercise before bed.
- Keep a journal of how you feel upon waking to identify any patterns.
`,
    high: `Emotional Check:
- Stress: {{stress}}/5
- Dream Anxiety: {{anxiety}}/5
- Mood: {{mood}}/5
High stress and anxiety levels can disrupt sleep and amplify vivid dreams.
Suggestions:
- Allocate 10–15 minutes daily for relaxation activities (e.g., walking, light stretching).
- Try writing down your thoughts in a journal upon waking to reduce anxiety.
`
  };

  // Șabloane pentru simboluri onirice (acum 10 intrări)
  private symbolTemplates: Record<string, { description: string }> = {
    // Existente:
    falling: {
      description: `"Falling" appeared multiple times, which often symbolizes a feeling of losing control.
Suggestion: Identify situations where you feel unstable (e.g., tight work deadlines or unresolved conflicts). Write them down and outline at least one actionable step for each to regain a sense of control.
`
    },
    water: {
      description: `"Water (murky)" indicates repressed or confusing emotions.
Suggestion: Reflect on the last time you felt emotionally overwhelmed and write a few sentences about it. Talking with a trusted friend or jotting down your feelings can help clarify your inner thoughts.
`
    },
    fire: {
      description: `"Fire" represents intense energy, transformation, or repressed anger.
Suggestion: List things that have been frustrating you lately, then choose a moderate physical activity (e.g., a 20-minute run or stretching) to help release that pent-up energy.
`
    },
    darkness: {
      description: `"Darkness" can indicate hidden fears or anxieties.
Suggestion: Ask yourself: "What scares me that I haven’t confronted?" Write down small steps to face that fear—maybe starting with a brief journaling session or a short conversation with someone you trust.
`
    },
    flying: {
      description: `"Flying" often symbolizes a desire for freedom or escape from stress.
Suggestion: Identify one area in your life where you feel constrained. Brainstorm one tiny way to create more freedom—like setting aside 10 minutes of "me time" daily.
`
    },
    // Adăugate:
    beingChased: {
      description: `"Being chased" frequently reflects avoidance of a problem or fear someone/something is 'after' you.
Suggestion: Pinpoint a real-life situation where you feel pressured or pursued. List coping strategies (e.g., delegating tasks, setting boundaries) and take one small step today to address it.
`
    },
    losingTeeth: {
      description: `"Losing teeth" can suggest anxieties about appearance, communication, or feeling powerless.
Suggestion: Reflect on your recent concerns about self-image or confidence. Write down three positive affirmations about yourself and practice them each morning.
`
    },
    naked: {
      description: `"Being naked in public" often indicates vulnerability or fear of being exposed.
Suggestion: Identify areas in your life where you feel overly exposed (like speaking in public). Practice preparing (e.g., rehearsing what you’ll say) or talk it through with a supportive friend to build confidence.
`
    },
    death: {
      description: `"Death" in dreams rarely signifies literal death; more often, it means transformation or an end to something.
Suggestion: Consider if there’s a chapter in your life you’re ready to close (job, relationship, habit). Write down what you want the 'new beginning' to look like and plan a small symbolic ceremony (e.g., burning a note).
`
    },
    exam: {
      description: `"Taking an exam" can symbolize evaluation, self‐expectation, or fear of failure.
Suggestion: Evaluate a current goal or project you feel judged on. Break it into sub‐tasks, set realistic deadlines, and give yourself permission to learn from mistakes instead of fearing judgment.
`
    }
  };

  // Determină categoria de somn
  /**
   * Determină calitatea somnului pe baza orelor de somn și a numărului de treziri.
   * Returnează 'good', 'moderate' sau 'poor'.
   */
  private categorizeSleep(hours: number, awakenings: number): 'good' | 'moderate' | 'poor' {
    // Dacă orele sunt foarte mari (>9) sau foarte mici (<4), marcăm ca "poor" (prea mult sau prea puțin somn)
    if (hours < 4 || hours > 9) {
      return 'poor';
    }

    // Cazuri clare de "good":
    // - 8–9 ore și 0–1 treziri
    // - 7–8 ore și 0 treziri
    if ((hours >= 8 && hours <= 9 && awakenings <= 1) ||
        (hours >= 7 && hours < 8 && awakenings === 0)) {
      return 'good';
    }

    // Cazuri clare de "poor":
    // - sub 5 ore, orice număr de treziri
    // - între 5 și 6 ore, dar >2 treziri
    // - 6–7 ore și >3 treziri
    if (
      hours < 5 ||
      (hours >= 5 && hours < 6 && awakenings > 2) ||
      (hours >= 6 && hours < 7 && awakenings > 3)
    ) {
      return 'poor';
    }

    // În orice alt caz, considerăm somnul "moderate"
    // Exemple incluse:
    // - 7–8 ore și 1–2 treziri
    // - 6–7 ore și 1–3 treziri
    // - 5–6 ore și <=2 treziri
    return 'moderate';
  }


  // Determină categoria emoțională
  /**
   * Determină categoria emoțională (low, moderate, high)
   * pe baza scorurilor de stres, anxietate și dispoziție.
   * 1 = foarte jos / foarte bună dispoziție, 5 = foarte sus / dispoziție foarte proastă
   */
  private categorizeEmotion(stress: number, anxiety: number, mood: number): 'low' | 'moderate' | 'high' {
    // 1. Dacă oricare dintre stres sau anxietate = 5 → high
    if (stress === 5 || anxiety === 5) {
      return 'high';
    }

    // 2. Dacă dispoziția = 1 (foarte bună) și restul sunt <= 2 → low
    if (mood === 1 && stress <= 2 && anxiety <= 2) {
      return 'low';
    }

    // 3. Dacă două dintre valorile (stres, anxietate, 6 - mood) sunt foarte mari → high
    //    Observație: 6 - mood => valoare inversată (1=>5, 5=>1) pentru a semnifica "problema emoțională"
    const invertedMood = 6 - mood;
    let highCount = 0;
    if (stress >= 4) highCount++;
    if (anxiety >= 4) highCount++;
    if (invertedMood >= 4) highCount++;
    if (highCount >= 2) {
      return 'high';
    }

    // 4. Dacă toate valorile sunt (stres <= 2) && (anxiety <= 2) && (invertedMood <= 2) → low
    if (stress <= 2 && anxiety <= 2 && invertedMood <= 2) {
      return 'low';
    }

    // 5. În orice altă combinație → moderate
    return 'moderate';
  }


  // Metodă apelată la click pe "Generate Report"
  generateReport(): void {
    if (
      this.sleepHours === null ||
      this.nightAwakenings === null ||
      this.timeToFall === null
    ) {
      this.report = 'Please fill in all required fields.';
      return;
    }

    const hours = this.sleepHours!;
    const awakenings = this.nightAwakenings!;
    const timeFall = this.timeToFall!;
    const stress = this.stressLevel;
    const anxiety = this.anxietyLevel;
    const mood = this.moodLevel;

    // 1. Bloc somn
    const sleepCat = this.categorizeSleep(hours, awakenings);
    let sleepBlock = this.sleepTemplates[sleepCat]
      .replace('{{hours}}', hours.toString())
      .replace('{{awakenings}}', awakenings.toString())
      .replace('{{timeToFall}}', timeFall.toString());

    // 2. Bloc emoții
    const emotionCat = this.categorizeEmotion(stress, anxiety, mood);
    let emotionBlock = this.emotionTemplates[emotionCat]
      .replace('{{stress}}', stress.toString())
      .replace('{{anxiety}}', anxiety.toString())
      .replace('{{mood}}', mood.toString());

    // 3. Bloc simboluri
    let symbolsBlock = '';
    if (this.symbols.length === 0) {
      symbolsBlock = `No recurring symbols detected. Your dreams might currently be free from major anxieties or unresolved emotions. Keep journaling even peaceful dreams.`;
    } else {
      // Contorizăm frecvențele
      const countMap: Record<string, number> = {};
      this.symbols.forEach(sym => {
        countMap[sym] = (countMap[sym] || 0) + 1;
      });
      // Sortăm după frecvență descrescătoare
      const sorted = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
      sorted.forEach(([sym, _]) => {
        if (this.symbolTemplates[sym]) {
          symbolsBlock += this.symbolTemplates[sym].description + '\n';
        }
      });
    }

    // 4. Combinăm în raport
    this.report = `=== Dream Quiz Report ===

1. Sleep Quality:
${sleepBlock}
2. Emotional Check:
${emotionBlock}
3. Dream Symbols Analysis:
${symbolsBlock}

=== End of Report ===`;
  }

  // Metodă apelată când se bifează/debifează un simbol
  onSymbolChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (input.checked) {
      if (!this.symbols.includes(value)) {
        this.symbols.push(value);
      }
    } else {
      this.symbols = this.symbols.filter(s => s !== value);
    }
  }
}
