#!/bin/bash
if ./build-blend.sh
then
	if ./build-test.sh
	then
		./build-themes.sh
	fi
fi

