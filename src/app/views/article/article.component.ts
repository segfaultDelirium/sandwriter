import { Component, OnInit } from '@angular/core';
import { UserViewableData } from '../../services/authentication.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { ArticleService } from './article.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

export type Comment = {
  id: string;
  author: UserViewableData;
  replies: Comment[];
  // replies_to: string | null; // comment id if is reply to another comment or null.
  text: string;

  upvotes: number;
  downvotes: number;
  is_upvoted_by_current_user: boolean;
  is_downvoted_by_current_user: boolean;

  inserted_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Article = {
  id: string;
  author: UserViewableData;
  comments: Comment[];

  title: string;
  text: string;

  upvotes: number;
  downvotes: number;
  is_upvoted_by_current_user: boolean;
  is_downvoted_by_current_user: boolean;

  inserted_at: string;
  updated_at: string;
  deleted_at: string | null;
};

const sampleUser: UserViewableData = {
  display_name: 'Giovanni Colantonio',
};

const sampleUser2: UserViewableData = {
  display_name: 'James Florence',
};

const sampleUser3: UserViewableData = {
  display_name: 'Matthew',
};

const sampleComments: Comment[] = [
  {
    id: 'gfdh7u344',
    author: sampleUser2,
    replies: [],
    text: 'I have never listened to Swift and read this entire piece. Incredible writing',

    upvotes: 79,
    downvotes: 12,
    is_downvoted_by_current_user: false,
    is_upvoted_by_current_user: false,

    inserted_at: '2024-04-21T19:02:11',
    updated_at: '2024-06-01',
    deleted_at: null,
  },
  {
    id: 'rfgoreh4835',
    author: sampleUser3,
    replies: [],
    text: "The fact that even an attempt to intellectualise Swift's curating of parasocial voyeurism can't get through a piece without naming both her ex boyfriends pretty much sums the entire thing up. If another singer of moderate success released this album, no one would be interested.",

    upvotes: 80,
    downvotes: 23,
    is_downvoted_by_current_user: false,
    is_upvoted_by_current_user: false,

    inserted_at: '2024-04-21T17:50:40',
    updated_at: '2024-06-01',
    deleted_at: null,
  },
];

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
  // sampleArticle
  // article: Article | null = sampleArticle;
  article: Article | null = null;
  articleSubscription?: Subscription;
  areCommentsVisible: boolean = false;

  commentInput: string = '';
  isCommentInputVisible = false;

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.getArticle();
  }

  getArticle() {
    this.articleSubscription = this.articleService
      .getArticle()
      .subscribe((article) => {
        this.article = article;
        console.log(article);
      });
  }

  ISOdateStringToLocaleDate(isoDateString: string) {
    const utcDate = new Date(`${isoDateString}Z`);
    const localTime = new Date(utcDate.getTime());
    return new Date(localTime).toLocaleString('sv');
  }

  toggleComments() {
    this.areCommentsVisible = !this.areCommentsVisible;
  }

  toggleLikeArticle() {
    if (this.article === null) {
      return;
    }
    this.article.is_upvoted_by_current_user =
      !this.article.is_upvoted_by_current_user;

    if (this.article.is_upvoted_by_current_user) {
      this.article.upvotes += 1;
    } else {
      this.article.upvotes -= 1;
    }

    if (
      this.article.is_upvoted_by_current_user &&
      this.article.is_downvoted_by_current_user
    ) {
      this.article.is_downvoted_by_current_user = false;
      this.article.downvotes -= 1;
    }

    this.articleService.likeArticle(this.article.id).subscribe((x) => {
      console.log(x);
    });
  }

  toggleDislikeArticle() {
    if (this.article === null) {
      return;
    }
    this.article.is_downvoted_by_current_user =
      !this.article.is_downvoted_by_current_user;

    if (this.article.is_downvoted_by_current_user) {
      this.article.downvotes += 1;
    } else {
      this.article.downvotes -= 1;
    }

    if (
      this.article.is_downvoted_by_current_user &&
      this.article.is_upvoted_by_current_user
    ) {
      this.article.is_upvoted_by_current_user = false;
      this.article.upvotes -= 1;
    }
    this.articleService.dislikeArticle(this.article.id).subscribe((x) => {
      console.log(x);
    });
  }

  showCommentInput() {
    this.isCommentInputVisible = true;
  }

  sendComment() {
    if (this.article === null) {
      return;
    }
    this.areCommentsVisible = true;
    this.articleService
      .sendComment(this.article.id, this.commentInput)
      .subscribe((comment) => {
        if (this.article === null) {
          return;
        }
        this.article.comments = [comment, ...this.article.comments];
      });
  }
}

const sampleArticle: Article = {
  id: 'a02afe6a-b35b-45cb-a3c9-0c9af3cf76d6',
  author: sampleUser,
  comments: sampleComments,

  title: `‘I think I might die if I made it’`,
  text: `<p>
      In the build up to the release of The Tortured Poets Department, Taylor Swift fans had it all figured out.
      Nevermind
      that they hardly had anything to go on.
    </p>
    <p>
      Though the singer’s 11th studio album was announced in the grandest way possible during a Grammys acceptance
      speech,
      the months leading up to its April 19 release date were filled with a silence that begged to be filled. There were
      no singles. No music videos. No teases as to what sound the ever-changing artist would deliver this time. And yet,
      the fans knew: This would be the ultimate break-up record, one dealing with Swift’s split with her longtime
      boyfriend, Joe Alwyn. Speculation became fact as Swifties salivated over the prospect of a gutting pop triumph
      filled with cutting barbs, pained catharsis, and plenty of real-world references for fans to hunt down like Easter
      eggs.
    </p>
    <p>
      Shortly after the clock struck midnight on release night, that confidence gave way to confusion.
    </p></p>
\t<p>
      As it turned out, The Tortured Poets Department wasn’t a long Alwyn diss track. Instead, its opening songs seemed
      to
      point towards a different subject: a short-lived love affair with The 1975 frontman Matt Healy. The pair’s
      whirlwind
      tryst became a matter of public litigation in mid-2023 as the Supreme Court of Swifties deemed that Healy, a
      controversial rockstar who lacked the clean public image of Swift’s previous partners, wasn’t the right match for
      their queen. A barrage of disapproving social media posts flooded in. When they cleared, the relationship had
      seemingly dissolved like a bath bomb in warm water, leaving behind faint stains in the bathtub.
    </p>
    That experience fuels the 16 tracks on The Tortured Poets Department, what’s already sure to go down as the artist’s
    most misunderstood work. It’s a shocking turn. Gone is the buttoned up every-girl with an iron tight grip on her
    public image; in her place stands a menace. She spends just over an hour detailing a messy obsession with a lost
    love, entertaining paranoid delusions, and lashing out at the very fans that raised her to mega-stardom. It may very
    well be the most hostile mainstream pop record we’ll ever see from an artist at this level of public attention.</p>
<p>On a surface listen, it’s easy to write the hour-long record off as a minor work in Swift’s colorful discography.
    It’s a positively plodding pop record. Opening track Fortnight is the closest it comes to delivering a radio-ready
    hit. From there, Swift goes back to the same well she’s drawn from on recent albums like Folklore and Midnights.
    Familiar melodies resurface, and the signature sounds that have netted Jack Antonoff a Producer of the Year Grammy
    for three-straight years begin to feel tired. Songs like Fresh Out The Slammer and The Alchemy seem to signal that
    Swift has found herself in a kind of creative corner that she’s always managed to write herself out of.</p>

<p>These aren’t just sentiments you’ll hear from her biggest haters, who seem a little too gleeful about the album’s
    tepid reception. A subset of Swift’s own fans have already become the album’s biggest critics. Some have seemingly
    turned on Antonoff, manifesting an end to another one of Swift’s partnerships. Others have turned their ire towards
    the lyrical content for delivering an unapologetic love letter to the fanbase’s public enemy rather than the Alwyn
    post-mortem they’d ordered. There’s even a sense that some are already fantasy booking her follow-up, hoping that
    her peppy relationship with Kansas City Chiefs tight end Travis Kelce manufactures some “bangers” like Big Macs on a
    McDonald’s assembly line.</p>

<p>But for the first time in her career, Taylor Swift doesn’t give a shit what you want.</p>

<p>There’s a surprising hostility in this collection of songs. She’s vicious in ways she’s only vaguely alluded to
    previously with empty threats like Look What You Made Me Do. That’s most apparent in But Daddy I Love Him, a
    five-and-a-half minute album centerpiece that would make a PR team faint. Here, Swift calls back to her country days
    in what almost plays like a modernization of breakout hit Love Story. She’s a kid again, riding with a wild
    boyfriend again that she’s not allowed to have. But it’s not her parents saying no this time; it’s her fans.</p>

<p>I’ll tell you something right now</p>

<p>I’d rather burn my whole life down</p>

<p>Than listen to one more second of all this bitchin’ and moanin’</p>

<p>I’ll tell you something ‘bout my good name</p>

<p>It’s mine alone to disgrace</p>

<p>I don’t cater to all these vipers dressed in empath’s clothing</p>

<p>It’s Swift at her most brutal, turning a serpentine insult that’s followed her throughout her career back on the
    people who claim to love her. She calls out a performative concern for her well-being in no uncertain terms,
    connecting it back to older songs that dealt with disapproving parents to underline how infantilizing it feels. “I
    just learned these people try and save you ’cause they hate you,” she sings.</p>

<p>That rage isn’t just isolated to one song. In Guilty as Sin?, she lashes out again: “If long-suffering propriety is
    what they want from me, they don’t know how you’ve haunted me stunningly, I choose you and me religiously.” Who’s
    Afraid of Little Old Me? is even more direct about its targets, calling out a TikTok trend in which fans try to
    sneak into her New York City home. “You caged me and then you called me crazy,” she spits out in the aggressive
    anthem’s closing moments.</p>

<p>That imagery is crucial to understanding The Tortured Poets Department and all of its eyebrow-raising creative
    choices. There’s a sense throughout the record that Swift feels trapped. She’s become a prisoner of her own success,
    with her fans taking on the role of wardens. It’s a self-made conundrum and one that invites some understandable
    eye-rolls. It’s not just a first-world problem; it’s an issue that only exists on an alien planet solely inhabited
    by someone as powerful as Swift.</p>

<p>Though cynicism is warranted, that doesn’t mean that The Tortured Poets Department doesn’t have value. In fact,
    Swift (perhaps inadvertently) offers up a razor sharp cultural critique about a kind of relationship that makes her
    partnership with Healy look healthy by comparison. That is: the parasocial relationships fans have with celebrities.
    The subtext here is that overprotective Swifties don’t actually have Taylor Swift’s best interest in mind. They want
    to control her, deciding who she dates, what her songs sound like, who gets to work on them, who she writes about,
    and how she does it. Swift has spent her whole career trying to squirm out of the grip of people who controlled her
    life, from “daddy” to greedy record executives. She didn’t come all this way for her own fans to micromanage her.</p>

<p>The songs here become her most painful in that light. The suite paints an exhaustively detailed picture of her one
    moment of bliss after a stagnant six-year relationship. The one song that gives fans the Alwyn debrief they craved,
    So Long, London, is also the album’s most anticlimactic moment. It’s a flat breakup song crooned over a sleepy bass
    drum. It goes nowhere, just like the relationship Swift memorializes. The songs (presumably) about Healy are
    significantly more impassioned, both musically and lyrically. The title track especially cuts in context of the full
    album, with the singer pouring her heart out in unflattering fashion.</p>

<p>Sometimes, I wonder if you’re gonna screw this up with me</p>

<p>But you told Lucy you’d kill yourself if I ever leave</p>

<p>And I had said that to Jack about you, so I felt seen</p>

<p>Everyone we know understands why it’s meant to be</p>

<p>’Cause we’re crazy</p>

<p>So tell me, who else is gonna know me?</p>

<p>You don’t have to become comrades with a billionaire to feel the tragedy here. Swift has long chronicled her
    frustrating search for true love. With The Tortured Poets Department, she implies that she found it — only to have
    it torn away from her by judgmental fans. Her life can never be her own while she’s in the eye of an adoring public
    who only sees her as a plaything.</p>

<p>That pain leads to both the album’s crowning achievement: the darkly comedic I Can Do It With a Broken Heart. Here,
    Swift sets a devious trap for fans who come to her demanding “bangers.” For the most part, the album resists the
    urge to give listeners something to dance to. Why would it? The singer has just spent nearly 50 minutes explaining
    how fed up she is of sacrificing what she wants to please everyone else. If she can’t have what she wants, why
    should you? Stay bored.</p>

<p>But just as all hope seems lost as the slow album winds down, she turns the dial up to 11. Suddenly, she’s singing a
    pure bubblegum pop song that’s even too peppy by Taylor Swift standards. While she operates in a low register for a
    good chunk of the album, she slips into an almost-childlike tone as she belts out a bop. It’s finally the song that
    antsy listeners have been waiting for.</p>

<p>The catch? It’s the most ruthless critique of her own fans yet.</p>

<p>Underneath the pristine pop production is a manic Swift powering through her agony to satiate the wolves. “Lights,
    camera, bitch, smile, even when you wanna die,” she sings amid a rising and falling melodic line that makes her
    sound like a wind-up toy being cranked back to life at the end of every exhausted phrase. She’s a dancing monkey on
    a stage, singing hours worth of hits for a crowd that only chants “more.” Are the arenas full of screaming fans
    there to support her, or simply consume her until there’s nothing left?</p>

<p>It’s with that question that The Tortured Poets Department reaches its haunting conclusion. In the harrowing Clara
    Bow, Swift once again returns to her bright-eyed youth as she looks to stars like Stevie Nicks and the song’s
    titular Hollywood starlet. At first, it sounds like an eye-rolling humble brag. She reflects on making it big,
    rising from a small town girl to the same level of superstardom as women like Nicks and Bow. Swift has been telling
    this underdog story throughout her career and it only becomes more tiresome the richer she gets.</p>

<p>Yet, the musical backdrop isn’t triumphant; it’s the album’s most dour composition. A monotonous bassline steadily
    thumps over distant textures that sound like organs soberly whining out a funeral hymn. Her pretty words take on
    double meaning in that fading light. “All your life, did you know you’d be picked like a rose?” she sings early on.
    It’s framed as a metaphor for being the lucky one, plucked into stardom, but we know what happens when you cut a
    rose: It’s a death sentence.</p>

<p>The girlhood fantasy transforms into a nightmare as Swift paints a picture of her damning reality. It’s her most
    effective moment of feminist clarity, reckoning with the devil’s bargain women sign when launched into stardom. Yes,
    she has the crown, but she can only keep it if she promises to “dazzle.” The moment that her “girlish glow
    flickers,” she’ll be spit out and replaced by the next woman ready to fall in line. Perhaps preemptively sensing the
    divisive reaction to her most brutally honest album to date, Swift breaks the fourth wall to end with a prophecy.</p>

<p>“You look like Taylor Swift</p>

<p>In this light, we’re lovin’ it</p>

<p>You’ve got edge, she never did</p>

<p>The future’s bright, dazzling”</p>

<p>Swift could have name-dropped any Hollywood “it girl” here, but the reference to Clara Bow is deliberate. Bow’s
    meteoric rise to stardom flamed out as quickly as it began, with her entire film career only lasting just over 10
    years before her retirement in 1933. In the decades following, she’d become the prototypical fallen star. She was
    plagued with mental illness, eventually diagnosed with schizophrenia. She left her family to live out the final
    years of her life in isolation. Well before her death by heart attack in 1965, Bow tried to end her own life in
    1944. A suicide note outlined her motive: She’d rather die than stay in the public eye.</p>

<p>“I’m not trying to exaggeratе, but I think I might die if I made it,” a naïve girl once dreamed as she looked up to
    her idols. Now peering out from her gilded cage, a weary Swift fears that she was right.</p>`,

  upvotes: 812,
  downvotes: 556,
  is_upvoted_by_current_user: false,
  is_downvoted_by_current_user: false,

  inserted_at: '2024-04-21T14:50:40',
  updated_at: '2024-06-01',
  deleted_at: null,
};
