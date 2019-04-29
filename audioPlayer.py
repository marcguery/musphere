#!/usr/bin/env python3

import vlc, time, random


vlc_instance = vlc.Instance()
player = vlc_instance.media_player_new()
media = vlc_instance.media_new("testSong.wav")
player.set_media(media)
playState = player.play()
if playState != 0:
	exit(1)
while player.is_playing() == 0:
	pass
duration = player.get_length() / 1000
t = 0
while t < duration:
	t+=0.01
	volume = player.audio_get_volume()
	print(volume, end="\r")
	player.audio_set_volume(volume)
	time.sleep(0.01)
