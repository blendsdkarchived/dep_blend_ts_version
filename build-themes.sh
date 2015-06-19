#!/bin/bash
function buildtheme {
	cd $1
	if compass compile
	then
		return 0
	else
		return 1;
	fi
}

echo building Blend SDK Themes
cd theme
buildtheme default
