import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule }     from '@angular/router';

interface Chapter {
  id: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
      CommonModule,
      RouterModule    // <-- if you ever use <a routerLink="…"> inside your template
    ],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {

  chapters: Chapter[] = [
    {
          id: 'history',
          title: 'Chapter 1: History of Dream Interpretation',
          content: `
                         <h4>History of Dream Interpretation</h4>
                         <p>
                           Throughout the millennia, dreams have been considered windows to the divine, to the subconscious, or to the future. Here’s who and how dreams were studied over time:
                         </p>
                         <ul>
                           <li>
                             <strong>Ancient Egypt (circa 2000 BCE)</strong> – The priests of dreams (initially in the Temple of Serapis, then in the Temple of Amon) transcribed dreams onto papyrus and believed they came from the gods.
                           </li>
                           <li>
                             <strong>Mesopotamia (circa 1800 BCE)</strong> – “Sacred” dreams were written on clay tablets. The Epic of Gilgamesh mentions some prophecies received in dreams.
                           </li>
                           <li>
                             <strong>Greece and Rome</strong> – Called “prophetic dreams” (“clariae”), they were interpreted by priests in the Asklepion temples (in Greece) and by augurs or haruspices (in Rome). Aristotle wrote “On Sleep and Dreams,” and Hippocrates associated dreams with organic imbalances.
                           </li>
                           <li>
                             <strong>European Middle Ages</strong> – Dreams were viewed either as divine messages or as demonic temptations. In medieval Christianity, practical guides for “interpreting dreams” appeared, as well as condemnations of “unclean” dreams.
                           </li>
                           <li>
                             <strong>19th Century</strong> – Franz Brentano began to analyze dreams from a psychological perspective. In 1899, Sigmund Freud published “The Interpretation of Dreams,” considering them fulfillments of repressed desires.
                           </li>
                           <li>
                             <strong>20th Century</strong> – Carl Jung introduced the idea of the “collective unconscious” and “archetypes,” and in the 1950s–60s, the discovery of the REM phase (Aserinsky & Kleitman) clearly linked dreams to rapid eye movements.
                           </li>
                         </ul>
                       `
        },
        {
          id: 'asia',
          title: 'Chapter 2: Dreams in Asia',
          content: `
                         <h4>Dreams in Asian Traditions</h4>
                         <p>
                           In Asia, dreams have often been integrated into spirituality, medicine, and deep philosophy:
                         </p>
                         <ul>
                           <li>
                             <strong>Ancient and Classical China</strong> – The text “Zhougong zhangmeng” (“Duke Zhou's Dream Manual”) is a treatise on dream interpretation (approx. 10th century BCE). In Taoism, dreams could be related to the yin-yang force and the balance of qi energy.
                           </li>
                           <li>
                             <strong>Vedic India</strong> – In the Upanishads, dreams are part of the four states of consciousness: wakefulness, dreaming sleep, dreamless sleep, and samadhi (spiritual ecstasy). Dreams were seen as opportunities to encounter the inner divine.
                           </li>
                           <li>
                             <strong>Japan (Edo and Meiji periods)</strong> – The theory “Genbun Itchi” (the convergence of language in dream and reality) inspired artists and writers. Even today, there are “dream interpreters” who practice traditional methods (e.g., Japanese feng shui).
                           </li>
                           <li>
                             <strong>Tibet and the Himalayas</strong> – In Tibetan Buddhism, there is the practice of “dream yoga,” in which monks learn to keep their consciousness active in dreams as part of the quest for enlightenment.
                           </li>
                           <li>
                             <strong>Southeast Asia</strong> – In indigenous tribes (e.g., tribes in Borneo), dreams are seen as dialogues with ancestral spirits. A local shaman receives guidance solely based on dreams.
                           </li>
                         </ul>
                       `
        },
        {
          id: 'modern',
          title: 'Chapter 3: Modern Dream Research',
          content: `
                         <h4>Modern Dream Research</h4>
                         <p>
                           Over the past two centuries, the study of dreams has become increasingly scientific and interdisciplinary:
                         </p>
                         <ul>
                           <li>
                             <strong>Discovery of the REM phase (1953)</strong> – Aserinsky & Kleitman observed rapid eye movements during sleep and associated these episodes with intense dreaming.
                           </li>
                           <li>
                             <strong>Sigmund Freud (1900)</strong> – Published “The Interpretation of Dreams,” in which dreams are considered fulfillments of repressed desires and the key to the subconscious.
                           </li>
                           <li>
                             <strong>Carl Jung (1930–1940)</strong> – Proposed the “collective unconscious” and studied dream symbols as universal archetypes.
                           </li>
                           <li>
                             <strong>EEG & fMRI studies</strong> – In the 1990s–2000s, research using electroencephalography and magnetic resonance imaging showed activation of the amygdala, hippocampus, and prefrontal cortex during REM sleep.
                           </li>
                           <li>
                             <strong>Lucid dream induction techniques</strong> – Methods such as MILD (Mnemonic Induction of Lucid Dreams), WBTB (Wake Back To Bed), and WILD (Wake-Initiated Lucid Dream) are validated by clinical studies, offering therapeutic perspectives (combating nightmares, creative exploration).
                           </li>
                         </ul>
                       `
        },
        {
          id: 'lucid',
          title: 'Chapter 4: Lucid Dreaming',
          content: `
                         <h4>Lucid Dreaming</h4>
                         <p>
                           Lucid dreaming occurs when the person becomes aware that they are dreaming and, in some cases, can control their actions within the dream.
                         </p>
                         <ul>
                           <li>
                             <strong>Origin of the term</strong> – Frederik van Eeden (1913) introduced the expression “lucid dream” after describing his personal experiences in which he knew he was in a dream.
                           </li>
                           <li>
                             <strong>Induction techniques</strong>:
                             <ul>
                               <li>
                                 MILD (Mnemonic Induction of Lucid Dreams) – repeating a “mantra” before sleep: “I will know that I'm dreaming.”
                               </li>
                               <li>
                                 WBTB (Wake Back To Bed) – waking up after a few hours of sleep, then returning to sleep with the intention of becoming lucid.
                               </li>
                               <li>
                                 WILD (Wake-Initiated Lucid Dream) – maintaining consciousness while falling asleep to enter directly into a lucid dream.
                               </li>
                             </ul>
                           </li>
                           <li>
                             <strong>EEG research</strong> – Electroencephalography studies show increased activation of the dorsolateral prefrontal cortex during lucid dreaming, similar to wakeful conscious states.
                           </li>
                           <li>
                             <strong>Therapeutic applications</strong> – Lucid dreaming can be used to combat recurring nightmares, enhance creativity, and study mental processes in controlled conditions.
                           </li>
                         </ul>
                       `
        },
        {
          id: 'symbols',
          title: 'Chapter 5: Dream Symbols & Culture',
          content: `
                         <h4>Dream Symbols & Culture</h4>
                         <p>
                           Dream symbols often reflect cultural context, beliefs, and personal experiences:
                         </p>
                         <ul>
                           <li>
                             <strong>Native Americans</strong> – Animals such as the owl, wolf, or eagle were seen as messengers of the spirits. Each tribe had a “dream interpreter” who connected the meaning of the symbol with the collective vision.
                           </li>
                           <li>
                             <strong>Aztecs & Maya</strong> – In pre-Columbian Mesoamerica, dreams involving gods such as Quetzalcoatl were considered prophecies for the tribe and were recorded in pictographic codices.
                           </li>
                           <li>
                             <strong>Medieval Europe</strong> – Dreams featuring fierce animals (e.g., snakes, lions) were interpreted as warnings from witches or divine signs about political decisions.
                           </li>
                           <li>
                             <strong>Modern era</strong> – Cultural psychologists show how dreams about war, exoduses, or famine appear among communities affected by conflicts.
                           </li>
                           <li>
                             <strong>Art and literature</strong> – Surrealist artists (Salvador Dalí, René Magritte) drew inspiration from dream symbols, exploring the boundary between the real and the imaginary.
                           </li>
                         </ul>
                       `
        },
        {
          id: 'dream-therapy',
          title: 'Chapter 6: Dream Therapy & Mental Health',
          content:  `
                         <h4>Dream Therapy & Mental Health</h4>
                         <p>
                           In modern psychotherapy, dreams not only reflect but can also aid in healing:
                         </p>
                         <ul>
                           <li>
                             <strong>Dream-based therapies</strong> – In cognitive-behavioral therapy, patients learn to analyze nightmares and reimagine them (Imagery Rehearsal Therapy) to reduce anxiety and PTSD (post-traumatic stress disorder).
                           </li>
                           <li>
                             <strong>Mindfulness and cognitive dreaming</strong> – The Mindfulness-Based Stress Reduction (MBSR) approach includes observing dreams to increase emotional awareness and reduce chronic stress.
                           </li>
                           <li>
                             <strong>Neurofeedback and sleep</strong> – Through real-time EEG monitoring, patients can learn to control dream activity to reduce the frequency of nightmares and improve sleep quality.
                           </li>
                           <li>
                             <strong>Jungian psychology</strong> – In dream therapy, Jungians explore “complexes” and “archetypes” using dream narratives as a means of psychological integration.
                           </li>
                         </ul>
                       `
        },
        {
          id: 'dream-tech',
          title: 'Chapter 7: Dream Tech & Gadgets',
          content: `
                         <h4>Dream Tech & Gadgets</h4>
                         <p>
                           In the digital era, technology and gadgets are becoming tools for exploring dreams:
                         </p>
                         <ul>
                           <li>
                             <strong>Portable EEG devices</strong> – Headsets that measure brainwaves in real time during sleep, notifying you when you enter REM phase so you can take notes or attempt a lucid dreaming technique.
                           </li>
                           <li>
                             <strong>Mobile dream journal apps</strong> – Applications that use AI to analyze recurring frequencies and themes in dreams, suggesting possible interpretations and psychological connections.
                           </li>
                           <li>
                             <strong>Virtual reality and lucid dreaming</strong> – VR prototypes that try to induce REM-like states or prepare the brain for lucid dreams through visual/audio stimuli before sleep.
                           </li>
                           <li>
                             <strong>Audio and light stimulation</strong> – Devices that emit light flashes or sonic beeps synchronized with sleep cycles to increase the chances of lucidity.
                           </li>
                         </ul>
                       `
        },
        {
          id: 'dream-symbolism',
          title: 'Chapter 8: Universal Dream Symbolism',
          content: `
                         <h4>Universal Dream Symbolism</h4>
                         <p>
                           Although dream symbols are often cultural, research has identified some recurring archetypes:
                         </p>
                         <ul>
                           <li>
                             <strong>Flying</strong> – Often associated with the desire for freedom, escape from stress, or the wish to transcend personal limits.
                           </li>
                           <li>
                             <strong>Darkness</strong> – May signify unconscious fears, repressed anxieties, or a step toward exploring hidden aspects of the psyche.
                           </li>
                           <li>
                             <strong>Water</strong> – Symbolizes emotions and the unconscious: murky waters may indicate anxiety, clear waters suggest emotional clarity and balance.
                           </li>
                           <li>
                             <strong>Fire</strong> – Finds its meaning in energy, transformation, or repressed anger.
                           </li>
                           <li>
                             <strong>Falling</strong> – Often associated with loss of control, fear of failure, or insecurities related to uncertainty.
                           </li>
                         </ul>
                       `
        },
        {
          id: 'dream-culture',
          title: 'Chapter 9: Dreams in World Literature & Art',
          content: `
                         <h4>Dreams in World Literature & Art</h4>
                         <p>
                           Dreams have inspired numerous literary works, paintings, and films:
                         </p>
                         <ul>
                           <li>
                             <strong>Classical literature</strong> – Shakespeare (“A Midsummer Night’s Dream”), Lewis Carroll (“Alice in Wonderland”), Goethe (“Faust”), and Dante (“The Divine Comedy”) used dreams as a narrative device.
                           </li>
                           <li>
                             <strong>Painting</strong> – René Magritte and Salvador Dalí explored surreal dreamscapes, blending familiar objects with bizarre elements.
                           </li>
                           <li>
                             <strong>Cinematography</strong> – Films such as “Inception” (Christopher Nolan) or “Wes Craven’s New Nightmare” put dreams at the forefront, experimenting with the boundaries of reality and the subconscious.
                           </li>
                           <li>
                             <strong>Opera and music</strong> – Composers like Wagner (“Tristan und Isolde”) and Romantic poets used dream themes in librettos and lyrics to evoke deep emotional states.
                           </li>
                         </ul>
                       `
        },
        {
          id: 'dream-future',
          title: 'Chapter 10: The Future of Dream Studies',
          content: `
                         <h4>The Future of Dream Studies</h4>
                         <p>
                           As technology and neuroscience advance, the study of dreams is heading toward new frontiers:
                         </p>
                         <ul>
                           <li>
                             <strong>Artificial intelligence and dream analysis</strong> – AI algorithms can quickly analyze thousands of dream reports, identifying patterns and simulating personalized interpretations for users.
                           </li>
                           <li>
                             <strong>Non-invasive brain stimulation</strong> – Techniques such as tDCS (transcranial direct current stimulation) or TMS (transcranial magnetic stimulation) aim to modulate brain activity during sleep to influence dream content.
                           </li>
                           <li>
                             <strong>Brain-computer interface (BCI)</strong> – Early research promises bidirectional communication with the brain during sleep, possibly to record dream fragments or induce specific scenarios.
                           </li>
                           <li>
                             <strong>Advanced therapeutic applications</strong> – Treating sleep disorders, anxiety, and PTSD through guided dream interventions in a controlled environment, using VR/XR and bioelectronic feedback.
                           </li>
                           <li>
                             <strong>Multidisciplinary scientific explorations</strong> – Biologists, psychologists, artists, and futurists collaborate to discover the role of dreams in creativity, memory, and human evolution.
                           </li>
                         </ul>
                       `
        }

  ];

  selectedId: string | null = null;

  selectChapter(id: string) {
      // Alternăm afișarea conținutului (deselect = închidem)
      this.selectedId = this.selectedId === id ? null : id;
      // De fiecare dată când selectăm un capitol, dăm scroll automat
      // să se vadă tot conținutul
      if (this.selectedId !== null) {
        setTimeout(() => {
          const card = document.getElementById(`chapter-${id}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      }
    }
}
