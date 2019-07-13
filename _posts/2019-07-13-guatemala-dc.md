---
title: "Dixon-Coles in Guatemala"
published: true
date:   2019-07-13
excerpt: Estimating team strength in the Guatemalan Liga Nacional using a simple Dixon-Coles model. The real goal here is being able to blend in as a proper fan.
---

In a few weeks my partner and I are taking a trip to Guatemala. Our trip coincides with the opening weekend of the Guatemalan Liga Nacional season and so we have planned to get to a game; [Antigua GFC](https://en.wikipedia.org/wiki/Antigua_GFC) host [C.D Malacateco](https://en.wikipedia.org/wiki/C.D._Malacateco) at Estadio Pensativo. My knowledge of the Liga Nacional is somewhat lacking so I decided I should brush up a bit. I thought a nice way to understand the league a bit more is to build a simple model to estimate team strength - this way I won't be caught short if any locals ask me for my pre-match opinions.


### Dixon-Coles model

The Dixon-Coles model is probably one of the most well known statistical models for estimating team strengths from football results. The model assumes goals follow a [poisson distribution](https://en.wikipedia.org/wiki/Poisson_distribution) & estimates a parameter for the attack (α) and defence (β) of each team such that, on average:

$goals_{home}\ =\ α_{home}\ * β_{away}\ * γ$

$goals_{away}\ =\ α_{away}\ * β_{home}$

where γ is home factor, how many more goals the home teams score than the away teams.

There is also a parameter to correct for some scoreline biases which they discuss in the [original paper](http://web.math.ku.dk/~rolf/teaching/thesis/DixonColes.pdf). For the sake of simplicity I'll be keeping this parameter in the background.


I fit the model on results for the 264 games from Liga Nacional 18/ 19 season, excluding playoff games. To fit the model I used the [regista package](http://regista.statsandsnakeoil.com/index.html) created by [Ben Torvaney](https://twitter.com/Torvaney). The ratings are shown below:



![GuatemalaRatings]({{ "/assets/images/guatemalaRatings.png" | relative_url }})

So, we can see from the plot that Antigua have both a good defence and good attack. Malacateco have a slightly better defence but they're not quite as good in attack according to the model. How would the teams perform against eachother?

We can work out each teams goals using the following equations:

$goals_{antigua}\ =\ α_{antigua}\ * β_{malacateco}\ * γ$
$goals_{malacateco}\ =\ α_{malacateco}\ * β_{antigua}$

Interestingly, the γ parameter in Guatemala is 1.91, so on average the home teams score almost double the amount that away teams score. Using this we can calculate the average goals for each team:

$goals_{antigua}\ =\ 1.353054\ * 0.621822\ * 1.910849\ =\ 1.6077095154$

$goals_{malacateco}\ = 0.900859\ * 0.642530\ = 0.578828$


### Simulating a game

If a local asks me for a prediction before the game I can hardly say that I predict 1.61 - 0.57 so I want to turn this into something a bit more intuitive. Remember that the model assumes that goals are poisson distribution, we can use this assumption to get a probability distribution for each teams goals. The plot below shows the probability of scoring X goals, given the average expected goals estimated above.

![poisson]({{ "/assets/images/poissonGoals.png" | relative_url }})

The final piece is to use this probability distribution to simulate the outcome of this game thousands of times, correcting for the scoreline biases mentioned above. When we do this we can then see what the most likely outcome is. Below is a heatmap showing the predicted outcomes for this game:
![scorelines]({{ "/assets/images/scorelines.png" | relative_url }})

Now if anyone asks me what I think the score might be, I can say that although Malacateco have a decent defence, I can't see them scoring and think Antigua will win 1-0.
