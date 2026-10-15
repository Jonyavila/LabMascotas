import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

type Props = {
    trigger: number; 
};

export default function AnimatedDog({ trigger }: Props) {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (trigger === 0) return; 
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 1.3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    }, [trigger]);

    return (
        <Animated.Text style={[styles.dog, { transform: [{ scale }] }]}>
            🐶
        </Animated.Text>
    );
}

const styles = StyleSheet.create({
    dog: {
        fontSize: 80,
        textAlign: 'center',
        marginVertical: 10,
    },
});