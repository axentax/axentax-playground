export const initialSyntax = `set.click.inst: 32 // 36 37 42
set.style.until: 1/3
set.style.scale: C major
set.click.velocity: 18

// sample
@@ {
  r:0/1:bd(reset)
  2|>>22|~~~:to(6/8):bd(../16 vib 0.5)
}

// sample
@@ {
  0|0|0|0|0|0:1/24:step(dud)
  Edim7~~~:to:bd(0..0 0, 4.. 1)
} >> {
  {
    ||12||:1/24:map(0 step 2 * 4):to
  }:map(0..4):scale(B minor):v85
  
  ||||13~:to(low):bd(.. 1)
} >> {
  {
    |9||:1/24:map(0 step 2 * 4):to
  }:map(0..4):scale(B minor):v85
  |||||15~:to(low):bd(.. 2)
}

// sample
@@ 1/8 160 {
  C7 /|||||5>>|||||7~~~:to(low) C7~~
  Fmaj7:stroke(1/8) /|||||5>>|||||7~~~:delay(1/4):to(low) Fmaj7~~:stroke(1/8)
  G7:stroke(1/8) /|||||3>>|||||6~~~:delay(1/4):to(low) G7~~:stroke(1/8)
  C7 /|||||5>>|||||10~~~:to(low)
  C#dim~~
}

// sample
@@ 1/8 160 {
  |0|5|5:step((543n.)5):m |0|7|7:step(fn.555):m
  |0|4|7:step(fn.5):m |0|3|5:step(fn.555):m
  |0|3|4:step((543n.)5):m |0|3|3|3:step(fn.555):m
  |0|5|5:step((543n.)5):m |0|7|7:step(fn.555):m
  |0|5|5:step((543n.)5):M |0|7|7:step(fn.555):M
  |0|4|7:step(fn.5):M |0|3|5:step(fn.555):M
  |0|3|4:step((543n.)5):M |0|3|3|3:step(fn.555):M
  |0|5|5:step((543n.)5):M |0|7|7:step(fn.555..):M
}

// sample
@@ 3/3 200 {
  ''Fm7:staccato(15/16)
  ''G7:staccato(15/16)
  @click(1/6)
  '''''Bm7b5~:to:bd(0..0 0, 4.. vib 0.17)
  @/click
}:v80

@@ 1/3 {
  1|:map(0 step -7 * 3):to:1/6
  @offset
  C:step((16)3^46^5..):v(88|88|88|77|66|55):1/3
  {
    C^:v65 C~~~~~~~~:v55:to(hi!4/8)
  }:v65
}
`;
