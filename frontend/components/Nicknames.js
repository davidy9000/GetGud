import React, { useEffect, useState } from "react";
import { View, TextInput, Text } from "react-native";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Nicknames(props) {

    const socket = props.socket;

    const [name2, setName2] = useState('');
    const [hasNickname, setHasNickname] = useState(false);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const value = await AsyncStorage.getItem('nickname');
                if(value != null){
                    setNickname(value);
                    setHasNickname(true);
                    socket.emit('updateNickname', {
                        newName: value
                    });
                }
            } catch(err) {
                console.log(err);
            }
        }
        loadData();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if(!hasNickname) {
                socket.emit('saveNickname', {
                    nickname: name2 
                });
                setHasNickname(true);
                await AsyncStorage.setItem('nickname', name2);
            } else {
                socket.emit('updateNickname', {
                    newName: name2
                });
                await AsyncStorage.setItem('nickname', name2);           
            }
            setNickname(name2);
            socket.emit('getNicknames');
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <View>
            {hasNickname ? (
                    <Text style={{ fontSize: "50px" }}>
                        Your name is currently {""}
                        <Text style={{ fontWeight: "bold" }}>{nickname}</Text>
                    </Text>
                ) : (
                    <Text style={{ fontSize: "50px" }}>
                        Please enter a name
                    </Text>
                )
            }

            <Text style={{ marginBottom: "10px" }}>
                If you do not like it, enter a new name here:
            </Text>
            <Grid spacing={2} container>
            <Grid item xs={8}>
                <TextInput
                    style={{
                        width: "100%",
                        height: 45,
                        borderColor: "gray",
                        borderWidth: 1,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                    }}
                    onChangeText={(text) => setName2(text)}
                    value={name2}
                />
            </Grid>
            <Grid item xs={4}>
                <Button
                    style={{ fontSize: "20px" }}
                    fullWidth
                    type="submit"
                    variant="outlined"
                    color="secondary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Grid>
            </Grid>
        </View>
    );
}
